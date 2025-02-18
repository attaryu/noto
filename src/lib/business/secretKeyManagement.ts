import { PUBLIC_IV, PUBLIC_SALT, PUBLIC_SECRET_KEY } from '$env/static/public';

import encryption from '$lib/utils/cryptography/encryption';
import keyManagement from '$lib/utils/cryptography/keyManagement';
import localStorageManagement from '$lib/utils/localStorageManagement';

async function storeSecretKey(secretKey: string) {
	const encryptionKey = await keyManagement.importKeyFromString(PUBLIC_SECRET_KEY, PUBLIC_SALT);
	const encryptedUserSecreyKey = await encryption.encrypt(secretKey, PUBLIC_IV, encryptionKey);

	localStorageManagement.store(localStorageManagement.key.SECRET_KEY, encryptedUserSecreyKey);
}

async function getSecretKey() {
	const encryptedUserSecreyKey = localStorageManagement.get(localStorageManagement.key.SECRET_KEY);

	if (encryptedUserSecreyKey) {
		const encryptionKey = await keyManagement.importKeyFromString(PUBLIC_SECRET_KEY, PUBLIC_SALT);
		const userSecretKey = await encryption.decrypt(
			encryptedUserSecreyKey,
			PUBLIC_IV,
			encryptionKey,
		);

		return userSecretKey;
	}

	return null;
}

export const secretKeyManagement = {
	storeSecretKey,
	getSecretKey,
};
