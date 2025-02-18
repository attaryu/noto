import type { z } from 'zod';

import type { ISigninPayload, ISigninResponse } from '$lib/types/api/auth/sign-in';
import type { IPasswordSaltResponse } from '$lib/types/api/users/password-salt';

import { goto } from '$app/navigation';
import _ from 'lodash';

import { secretKeyManagement } from '$lib/business/secretKeyManagement';
import { createMutation } from '$lib/hooks/createMutation.svelte';
import { createQuery } from '$lib/hooks/createQuery.svelte';
import { createValidation } from '$lib/hooks/createValidation.svelte';
import { axiosFetch } from '$lib/stores/api/baseConfig';
import { getDialogStoreContext } from '$lib/stores/dialog.svelte';
import encryption from '$lib/utils/cryptography/encryption';
import { hashing } from '$lib/utils/cryptography/hashing';
import keyManagement from '$lib/utils/cryptography/keyManagement';
import { signinUserValidator } from '$lib/validator/user';

export function signInController() {
	const dialog = getDialogStoreContext();

	const form = createValidation<z.infer<typeof signinUserValidator>>(signinUserValidator, {
		email: '',
		password: '',
	});

	const passwordQuery = createQuery({
		queryKey: ['users', 'password'],
		queryFn: () =>
			axiosFetch.GET<IPasswordSaltResponse>(`/users/password-salt?email=${form.fields.email}`),
		enabled: false,
		retry: false,
	});

	const refetchPasswordQuery = _.debounce(() => {
		passwordQuery.refetch();
	}, 500);

	$effect(() => {
		if (form.fields.email) {
			refetchPasswordQuery();
		}
	});

	let passwordCryptoKey = $state<CryptoKey | undefined>();

	const signinMutation = createMutation({
		mutationFn: (payload: ISigninPayload) =>
			axiosFetch.POST<ISigninResponse, ISigninPayload>('/auth/sign-in', payload),
		onSuccess: async (data) => {
			if (data) {
				const { user } = data.payload;

				if (user && passwordCryptoKey) {
					const secretKey = await encryption.decrypt(
						user.secretKey.value,
						user.secretKey.iv,
						passwordCryptoKey,
					);

					await secretKeyManagement.storeSecretKey(secretKey);

					goto('/app/notes');
				}
			}
		},
		onError: (error) => {
			dialog.setDialog({
				message: error.error.message ?? 'An error occurred',
				type: 'error',
			});
		},
	});

	const submitHandler = form.submitHandler(async (fields) => {
		if (passwordQuery.data?.success) {
			const importedPasswordKey = await keyManagement.importKeyFromString(
				fields.password,
				passwordQuery.data.payload.salt,
			);

			const exportedPasswordKey = await keyManagement.exportKey(importedPasswordKey);
			const hashedPasswordKey = await hashing(exportedPasswordKey);

			passwordCryptoKey = importedPasswordKey;

			signinMutation.mutate({
				...fields,
				password: hashedPasswordKey,
			});
		}
	});

	const _emailErrorMessage = $derived(
		passwordQuery.isError && form.fields.email
			? passwordQuery.error?.error.message
			: form.errors?.email,
	);

	return {
		get emailErrorMessage() {
			return _emailErrorMessage;
		},
		form,
		signinMutation,
		passwordQuery,
		submitHandler,
	};
}
