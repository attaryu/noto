import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import { NoteEntity } from '$lib/server/domain/entities/note';
import { NoteError } from '$lib/server/domain/errors/Note';
import type { IGetNote } from '../GetNote';

export class GetNote implements IGetNote {
	constructor(private readonly noteRepository: INoteRepository) {}

	async execute(userId: string, noteId: string): Promise<INoteOutDTO> {
		const noteFromDatabase = await this.noteRepository.findById(noteId);

		if (!noteFromDatabase) {
			throw new NoteError.NotFound();
		}

		const noteEntity = new NoteEntity(noteFromDatabase);

		if (!noteEntity.isOwnedBy(userId)) {
			throw new NoteError.UnauthorizedOwner();
		}

		const { deletedAt, userId: _userId, ...note } = noteFromDatabase;

		return note;
	}
}
