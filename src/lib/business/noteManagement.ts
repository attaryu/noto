import type { JSONContent } from '@tiptap/core';

import type { INotePayload } from '$lib/types/api/notes';

import { generateText } from '@tiptap/core';
import { removeStopwords } from 'stopword';

import encryption from '$lib/utils/cryptography/encryption';
import { generateRandomChar } from '$lib/utils/cryptography/generateRandomChar';
import { extensions } from '$lib/utils/editor';

async function encrypt(note: JSONContent, iv: string, secreyKey: CryptoKey): Promise<string> {
	return encryption.encrypt(JSON.stringify(note), iv, secreyKey);
}

async function decrypt(note: string, iv: string, secreyKey: CryptoKey): Promise<JSONContent> {
	const decryptedContent = await encryption.decrypt(note, iv, secreyKey);
	return JSON.parse(decryptedContent);
}

function processContent(text: JSONContent) {
	const rawText = generateText(text, extensions)
		.trim()
		.replace(/\n/g, ' ') // remove new lines
		.replace(/[\p{P}\p{S}]/gu, '') // remove any punctuation or symbols
		.split(' ');

	return removeStopwords(rawText);
}

async function transform(note: JSONContent, secreyKey: CryptoKey): Promise<INotePayload> {
	const iv = generateRandomChar(16);
	const encryptedContent = await encrypt(note, iv, secreyKey);

	const splittedRawText = processContent(note);

	const index: string[] = [];

	for (const word of splittedRawText) {
		if (word && !index.includes(word)) {
			index.push(word);
		}
	}

	const encryptedIndex = await Promise.all(
		index.map((word) => encryption.encrypt(word, iv, secreyKey)),
	);

	return {
		iv,
		labels: [],
		index: encryptedIndex,
		content: encryptedContent,
	};
}

export default {
	transform,
	decrypt,
};
