import type { NoteInterface } from '../../entities/note';

export class NoteEntityError extends Error {
	constructor(property: keyof NoteInterface) {
		super(`Property ${property} is not suitable`);
	}
}
