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
		// make a AES key for notes encryption
		const secretKey = await keyManagement.generateKey();
		const exportedSecretKey = await keyManagement.exportKey(secretKey);

		// make a PBKDF2 key from password for secret key encryption
		const passwordSalt = generateRandomChar(32);
		const passwordKey = await keyManagement.importKeyFromString(fields.password, passwordSalt);
		const exportedPasswordKey = await keyManagement.exportKey(passwordKey);
		// hash a PBKDF2 key from password
		const hashedPasswordKey = await hashing(exportedPasswordKey);

		// encrypt secret key with PBKDF2 key
		const secretKeyIv = generateRandomChar(16);
		const encryptedSecretKeyWithPasswordKey = await encryption.encrypt(
			exportedSecretKey,
			secretKeyIv,
			passwordKey,
		);

		// make recovery keys
		recoveryKeys = Array(8)
			.fill('placeholder')
			.map(() => generateRandomChar(8, true));

		// produce encrypted recovery key
		const encryptedSecretKeyWithRecoveryKeys = await Promise.all(
			recoveryKeys.map(async (recoveryKey) => {
				// make PBKDF2 key from secret key
				const salt = generateRandomChar(32);
				const recoveryKeyPBKDF2 = await keyManagement.importKeyFromString(recoveryKey, salt);

				// encrypt secret key with PBKDF2 key from recovery key
				const iv = generateRandomChar(16);
				const encryptedRecoveryKey = await encryption.encrypt(
					exportedSecretKey,
					iv,
					recoveryKeyPBKDF2,
				);

				return {
					// return first four digits from recovery key
					code: recoveryKey.slice(0, 4),
					value: encryptedRecoveryKey,
					iv,
					salt,
				};
			}),
		);

		signupMutation.mutate({
			fullname: fields.fullname,
			email: fields.email,
			password: {
				value: hashedPasswordKey,
				salt: passwordSalt,
			},
			secretKey: {
				value: encryptedSecretKeyWithPasswordKey,
				iv: secretKeyIv,
			},
			recoveryKeys: encryptedSecretKeyWithRecoveryKeys,
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
