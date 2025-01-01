export class NoteContentError extends Error {
	constructor() {
		super(`indexedwords and content properties are required if one of them is defined.`);
		this.name = 'NoteContentError';
	}
}
