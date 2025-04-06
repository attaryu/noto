import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { IGetNote } from '../GetNote';

import { NoteEntity } from '$lib/server/domain/entities/note';
import { NoteError } from '$lib/server/domain/errors/Note';

export class GetNote implements IGetNote {
	constructor(private readonly noteRepository: INoteRepository) {}

	async execute(userId: string, noteId: string): Promise<INoteOutDTO> {
		const existingNote = await this.noteRepository.findById(noteId);

		if (!existingNote) {
			throw new NoteError.NotFound();
		}

		const noteEntity = new NoteEntity(existingNote);

		if (noteEntity.isDeleted) {
			throw new NoteError.AlreadyDeleted();
		}

		if (!noteEntity.isOwnedBy(userId)) {
			throw new NoteError.UnauthorizedOwner();
		}

		const { deletedAt, userId: _userId, id, ...note } = noteEntity.toObject();

		return { ...note, id: id! };
	}
}
