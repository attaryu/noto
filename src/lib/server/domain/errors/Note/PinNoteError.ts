export class PinNoteError extends Error {
	constructor() {
		super("Can't make pin on archived notes.");
		this.name = 'PinNoteError';
	}
}
