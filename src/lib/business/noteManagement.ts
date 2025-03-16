import type { JSONContent } from '@tiptap/core';

import type { INotePayload } from '$lib/types/api/notes';

import { generateText } from '@tiptap/core';
import { removeStopwords } from 'stopword';

import encryption from '$lib/utils/cryptography/encryption';
import { generateRandomChar } from '$lib/utils/cryptography/generateRandomChar';
import { extensions } from '$lib/utils/editor';
import { hashing } from '$lib/utils/cryptography/hashing';

async function encrypt(note: JSONContent, secretKey: CryptoKey, iv: string): Promise<string> {
	return encryption.encrypt(JSON.stringify(note), iv, secretKey);
}

async function decrypt(note: string, secretKey: CryptoKey, iv: string): Promise<JSONContent> {
	const decryptedContent = await encryption.decrypt(note, iv, secretKey);
	return JSON.parse(decryptedContent);
}

/**
 * Generates an index of text and hash it
 *
 * @param text text to be indexed
 */
async function textIndexing(text: string) {
	const rawText = text
		.trim()
		.replace(/\n/g, ' ') // remove new lines
		.replace(/[\p{P}\p{S}]/gu, '') // remove any punctuation or symbols
		.toLowerCase()
		.split(' ');

	const cleanText = removeStopwords(rawText);

	const index: string[] = [];

	for (const word of cleanText) {
		if (word && !index.includes(word)) {
			index.push(word);
		}
	}

	const hashedIndex = await Promise.all(index.map((word) => hashing(word)));

	return hashedIndex;
}

/**
 * Encrypts the content and generates an index for the content
 *
 * @param content note content
 * @param secretKey  user secret key
 * @param iv iv for the encryption
 */
async function processContent(content: JSONContent, secretKey: CryptoKey, iv?: string) {
	// Generate a random IV if not provided
	const _iv = iv ?? generateRandomChar(16);

	const encryptedContent = await encrypt(content, secretKey, _iv);
	const index = await textIndexing(generateText(content, extensions));

	return {
		iv: _iv,
		index,
		content: encryptedContent,
	};
}

export default {
	processContent,
	textIndexing,
	decrypt,
};
