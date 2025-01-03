import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IDeleteNotes } from '../DeleteNotes';

import { NoteEntity } from '$lib/server/domain/entities/note';
import { NoteError } from '$lib/server/domain/errors/Note';

export class DeleteNotes implements IDeleteNotes {
	constructor(private readonly noteRepository: INoteRepository) {}

	async execute(noteId: string[], userId: string): Promise<void> {
		const notes = await this.noteRepository.findManyByFilter({ noteId });

		if (!notes.length) {
			throw new NoteError.NotFound();
		}

		for (const _note of notes) {
			const note = new NoteEntity(_note);

			if (!note.isOwnedBy(userId)) {
				throw new NoteError.UnauthorizedOwner();
			}

			if (note.isDeleted) {
				throw new NoteError.AlreadyDeleted(note.id);
			}
		}

		await this.noteRepository.softDeletes(noteId, userId);
	}
}
