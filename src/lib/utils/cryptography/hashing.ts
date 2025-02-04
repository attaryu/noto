import { bufferToBase64 } from './bufferConverter';

export async function hashing(text: string) {
	const encodedText = new TextEncoder().encode(text);

	const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);

	const hashString = bufferToBase64(hashBuffer);

	return hashString;
}
