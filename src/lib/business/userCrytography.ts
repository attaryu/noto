import encryption from '$lib/utils/cryptography/encryption';
import { generateRandomChar } from '$lib/utils/cryptography/generateRandomChar';
import { hashing } from '$lib/utils/cryptography/hashing';
import keyManagement from '$lib/utils/cryptography/keyManagement';

async function generatePasswordKey(password: string, salt: string) {
	// make a PBKDF2 key from password for secret key encryption
	const key = await keyManagement.importKeyFromString(password, salt);
	const exportedKey = await keyManagement.exportKey(key);
	// hash a PBKDF2 key from password
	const hashedKey = await hashing(exportedKey);

	return { key, exportedKey, hashedKey };
}

async function generateCryptoKeys(password: string) {
	const secretKey = await keyManagement.generateKey();
	const exportedSecretKey = await keyManagement.exportKey(secretKey);

	const passwordSalt = generateRandomChar(32);
	const passwordKey = await generatePasswordKey(password, passwordSalt);

	// encrypt secret key with PBKDF2 key
	const secretKeyIv = generateRandomChar(16);
	const encryptedSecretKeyWithPasswordKey = await encryption.encrypt(
		exportedSecretKey,
		secretKeyIv,
		passwordKey.key,
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
				code: recoveryKey.slice(0, 4), // first four digits from recovery key
				value: encryptedRecoveryKey,
				iv,
				salt,
			};
		}),
	);

	return {
		secretKey: {
			value: encryptedSecretKeyWithPasswordKey,
			iv: secretKeyIv,
		},
		password: {
			value: passwordKey.hashedKey,
			salt: passwordSalt,
		},
		recoveryKeys,
		encryptedRecoveryKeys: encryptedSecretKeyWithRecoveryKeys,
	};
}

export const userCryptography = {
	generatePasswordKey,
	generateCryptoKeys,
};
