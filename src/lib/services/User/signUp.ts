import type { ICreateUserInputDTO } from '$lib/types/entities/User';
import encryption from '$lib/utils/cryptography/encryption';
import { generateRandomChar } from '$lib/utils/cryptography/generateRandomChar';
import { hashing } from '$lib/utils/cryptography/hashing';
import keyManagement from '$lib/utils/cryptography/keyManagement';

export interface ICryptography {
	fullname: string,
	email: string,
	password: {
		value: string;
		salt: string;
	};
	secretKey: {
		value: string;
		iv: string;
	};
	recoveryKeys: string[];
	encryptedRecoveryKeys: Array<{
		code: string;
		value: string;
		salt: string;
		iv: string;
	}>;
}

export async function signUp(user: ICreateUserInputDTO): Promise<ICryptography> {
	// make a AES key for notes encryption
	const secretKey = await keyManagement.generateKey();
	const exportedSecretKey = await keyManagement.exportKey(secretKey);

	// make a PBKDF2 key from password for secret key encryption
	const salt = generateRandomChar(32);
	const passwordKey = await keyManagement.importKeyFromString(user.password, salt);
	const exportedPasswordKey = await keyManagement.exportKey(passwordKey);
	// hash a PBKDF2 key from password
	const hashedPasswordKey = await hashing(exportedPasswordKey);

	// encrypt secret key with PBKDF2 key
	const iv = generateRandomChar(16);
	const encryptedSecretKeyWithPasswordKey = await encryption.encrypt(
		exportedSecretKey,
		iv,
		passwordKey,
	);

	// make recovery keys
	const recoveryKeys = Array(8)
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

	return {
		...user,
		password: {
			value: hashedPasswordKey,
			salt,
		},
		secretKey: {
			value: encryptedSecretKeyWithPasswordKey,
			iv,
		},
		recoveryKeys,
		encryptedRecoveryKeys: encryptedSecretKeyWithRecoveryKeys,
	};
}
