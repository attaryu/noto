import type { z } from 'zod';

import type { ISignupPayload, ISignupResponse } from '$lib/types/api/auth/sign-up';

import { goto } from '$app/navigation';

import { createMutation } from '$lib/hooks/createMutation.svelte';
import { createValidation } from '$lib/hooks/createValidation.svelte';

import { axiosFetch } from '$lib/stores/api/baseConfig';
import { getDialogStoreContext } from '$lib/stores/dialog.svelte';
import encryption from '$lib/utils/cryptography/encryption';
import { generateRandomChar } from '$lib/utils/cryptography/generateRandomChar';
import { hashing } from '$lib/utils/cryptography/hashing';
import keyManagement from '$lib/utils/cryptography/keyManagement';
import { signupUserValidator } from '$lib/validator/user';
import { userCryptography } from '$lib/business/userCrytography';

export function signUpController() {
	const dialog = getDialogStoreContext();

	let recoveryKeys = $state.raw<string[]>([]);

	const form = createValidation<z.infer<typeof signupUserValidator>>(signupUserValidator, {
		fullname: '',
		email: '',
		password: '',
		repeatPassword: '',
	});

	const _isPasswordNotSame = $derived(form.fields.password !== form.fields.repeatPassword);

	const signupMutation = createMutation({
		mutationFn: (payload: ISignupPayload) =>
			axiosFetch.POST<ISignupResponse, ISignupPayload>('/auth/sign-up', payload),
		onSuccess: () => {
			goto('/app/recovery-key', { state: { recoveryKeys } });
		},
		onError: (error) => {
			dialog.setDialog({
				message: error.error.message ?? 'An error occurred',
				type: 'error',
			});
		},
	});

	const signUpHandler = form.submitHandler(async (fields) => {
		const { encryptedRecoveryKeys, ...cryptographyKeys } =
			await userCryptography.generateCryptoKeys(fields.password);

		recoveryKeys = cryptographyKeys.recoveryKeys;

		signupMutation.mutate({
			...cryptographyKeys,
			fullname: fields.fullname,
			email: fields.email,
			recoveryKeys: encryptedRecoveryKeys,
		});
	});

	return {
		get isPasswordNotSame() {
			return _isPasswordNotSame;
		},

		form,
		signupMutation,
		signUpHandler,
	};
}
