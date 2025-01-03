import type { NoteInterface } from '../entities/note';

export namespace NoteError {
	export class Content extends Error {
		constructor() {
			super(`indexedwords and content properties are required if one of them is defined.`);
			this.name = 'NoteContentError';
		}
	}

	export class Entity extends Error {
		constructor(property: keyof NoteInterface) {
			super(`Property ${property} is not suitable`);
		}
	}

	export class NotFound extends Error {
		constructor() {
			super('The requested note not found.');
			this.name = 'NoteNotFoundError';
		}
	}

	export class UnauthorizedOwner extends Error {
		constructor() {
			super('You are not authorized to update this note.');
			this.name = 'UnauthorizedNoteOwnerError';
		}
	}

	export class Pin extends Error {
		constructor() {
			super("Can't make pin on archived notes.");
			this.name = 'PinNoteError';
		}
	}

	export class AmountExceeded extends Error {
		constructor() {
			super('The requested offset equals or exceeds the original amount.');
			this.name = 'NoteAmountExceededError';
		}
	}

	export class AlreadyDeleted extends Error {
		constructor(noteId?: string) {
			if (noteId) {
				super(`Note with id ${noteId} have been deleted.`);
			} else {
				super('The requested note have been deleted');
			}

			this.name = 'NoteAlreadyDeletedError';
		}
	}
}
