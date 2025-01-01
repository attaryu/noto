import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { IUpdateNoteDTO } from '$lib/server/domain/dtos/Note/UpdateNote';
import type { IUpdateNote } from '../UpdateNote';

import { NoteEntity } from '$lib/server/domain/entities/note';
import { NoteError } from '$lib/server/domain/errors/Note';

export class UpdateNote implements IUpdateNote {
	constructor(private readonly noteRepository: INoteRepository) {}

	async execute(
		userId: string,
		noteId: string,
		optionalNote: IUpdateNoteDTO,
	): Promise<INoteOutDTO> {
		const existingNote = await this.noteRepository.findById(noteId);

		if (!existingNote) {
			throw new NoteError.NotFound(noteId);
		}

		const noteEntity = new NoteEntity(existingNote);

		if (!noteEntity.isOwnedBy(userId)) {
			throw new NoteError.UnauthorizedOwner();
		}

		const noteEntityUpdate = noteEntity.update(optionalNote);

		const {
			deletedAt,
			createdAt,
			userId: _userId,
			...updatedNote
		} = await this.noteRepository.update(noteId, noteEntityUpdate);

		return updatedNote;
	}
}
