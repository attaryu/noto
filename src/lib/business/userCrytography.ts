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

/**
 * Generate recovery keys.
 * 
 * @param exportedSecretKey exported secret key
 */
async function generateRecoveryKeys(exportedSecretKey: string) {
	// make recovery keys
	const raw = Array(8)
		.fill('placeholder')
		.map(() => generateRandomChar(8, true));

	// produce encrypted recovery key
	const encrypted = await Promise.all(
		raw.map(async (recoveryKey) => {
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

	return { raw, encrypted };
}

/**
 * Generate crypto keys for user security.
 * 
 * @param password user password
 */
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

	const recoveryKeys = await generateRecoveryKeys(exportedSecretKey);

	return {
		secretKey: {
			value: encryptedSecretKeyWithPasswordKey,
			iv: secretKeyIv,
		},
		password: {
			value: passwordKey.hashedKey,
			salt: passwordSalt,
		},
		recoveryKeys: recoveryKeys.raw,
		encryptedRecoveryKeys: recoveryKeys.encrypted,
	};
}

/**
 * Regenerate crypto keys for user security based on new
 * password and existring secret key.
 * 
 * @param password user password.
 * @param secretKey user secret key.
 */
async function regenerateCryptoKeys(password: string, secretKey: string) {
	const passwordSalt = generateRandomChar(32);
	const passwordKey = await generatePasswordKey(password, passwordSalt);

	const secretKeyIv = generateRandomChar(16);
	const encryptedSecretKeyWithPasswordKey = await encryption.encrypt(
		secretKey,
		secretKeyIv,
		passwordKey.key,
	);

	const recoveryKeys = await generateRecoveryKeys(secretKey);

	return {
		secretKey: {
			value: encryptedSecretKeyWithPasswordKey,
			iv: secretKeyIv,
		},
		password: {
			value: passwordKey.hashedKey,
			salt: passwordSalt,
		},
		recoveryKeys: recoveryKeys.raw,
		encryptedRecoveryKeys: recoveryKeys.encrypted,
	};
}

export const userCryptography = {
	generatePasswordKey,
	generateCryptoKeys,
	regenerateCryptoKeys,
};
