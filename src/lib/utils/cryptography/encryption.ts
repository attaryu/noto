import { base64ToBuffer, bufferToBase64 } from './bufferConverter';

const ALGORITHM = 'AES-GCM';

async function encrypt(payload: string, iv: string, key: CryptoKey) {
	const textEncoder = new TextEncoder();

	const encryptedPayloadBuffer = await crypto.subtle.encrypt(
		{
			name: ALGORITHM,
			iv: textEncoder.encode(iv),
		},
		key,
		textEncoder.encode(payload),
	);

	const encryptedPayloadString = bufferToBase64(encryptedPayloadBuffer);

	return encryptedPayloadString;
}

async function decrypt(encryptedPayloadString: string, iv: string, key: CryptoKey) {
	const encryptedPayloadBuffer = base64ToBuffer(encryptedPayloadString);

	const payload = await crypto.subtle.decrypt(
		{ name: ALGORITHM, iv: new TextEncoder().encode(iv) },
		key,
		encryptedPayloadBuffer,
	);

	const decodedPayload = new TextDecoder().decode(payload);

	return decodedPayload;
}

export default {
	encrypt,
	decrypt,
};
