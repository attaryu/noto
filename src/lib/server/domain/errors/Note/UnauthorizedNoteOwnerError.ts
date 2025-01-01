export class UnauthorizedNoteOwnerError extends Error {
	constructor() {
		super('You are not authorized to update this note.');
		this.name = 'UnauthorizedNoteOwnerError';
	}
}
