import { base64ToBuffer, bufferToBase64 } from './bufferConverter';

const ALGORITHM = 'AES-GCM';

/**
 * generate AES key for cryptography
 *
 * @returns CryptoKey
 */
const generateKey = async () => {
	const cryptoKey = await crypto.subtle.generateKey({ name: ALGORITHM, length: 256 }, true, [
		'encrypt',
		'decrypt',
	]);

	return cryptoKey;
};

/**
 * import base64 crypto key string from external to CryptoKey web native
 *
 * @param stringKey base64 string from external cryptography key
 * @returns CryptoKey
 */
const importKey = async (stringKey: string) => {
	const bufferKey = base64ToBuffer(stringKey);

	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		bufferKey,
		{ name: ALGORITHM, length: 256 },
		true,
		['encrypt', 'decrypt'],
	);

	return cryptoKey;
};

/**
 * export CryptoKey from web native to base64 string
 *
 * @param cryptoKey web native CryptoKey
 * @returns base64 string
 */
const exportKey = async (cryptoKey: CryptoKey) => {
	const rawKey = await crypto.subtle.exportKey('raw', cryptoKey);

	const stringKey = bufferToBase64(rawKey);

	return stringKey;
};

/**
 * make a crypto key from raw string
 *
 * @param rawString any string
 * @param salt random 32 length character
 * @returns derived CryptoKey
 */
const importKeyFromString = async (rawString: string, salt: string) => {
	const textEncoder = new TextEncoder();
	const encodedRawString = textEncoder.encode(rawString);
	const encodedSalt = textEncoder.encode(salt);

	const baseKey = await crypto.subtle.importKey('raw', encodedRawString, 'PBKDF2', false, [
		'deriveKey',
	]);

	const pbkdf2Key = await crypto.subtle.deriveKey(
		{ name: 'PBKDF2', iterations: 100000, salt: encodedSalt, hash: 'SHA-256' },
		baseKey,
		{ name: 'AES-GCM', length: 256 },
		true,
		['encrypt', 'decrypt'],
	);

	return pbkdf2Key;
};

export default {
	exportKey,
	importKey,
	generateKey,
	importKeyFromString,
};
