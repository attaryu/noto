import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { ICreateNote } from '../CreateNote';

import { NoteEntity } from '$lib/server/domain/entities/note';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';

export class CreateNote implements ICreateNote {
	constructor(
		private readonly noteRepository: INoteRepository,
		private readonly userRepository: IUserRepository,
	) {}

	async execute(newNote: ICreateNoteDTO): Promise<INoteOutDTO> {
		const noteEntity = NoteEntity.create(newNote);
		const existingUser = await this.userRepository.findById(noteEntity.userId);

		if (!existingUser) {
			throw new UserNotFoundError('id', noteEntity.userId);
		}

		const note = await this.noteRepository.create({
			content: noteEntity.content,
			indexedWords: noteEntity.indexedWords,
			labels: noteEntity.labels,
			userId: noteEntity.userId,
		});

		return {
			id: note.id,
			content: note.content,
			indexedWords: note.indexedWords,
			labels: note.labels,
			archived: note.archived,
			pinned: note.pinned,
			createdAt: note.createdAt,
		};
	}
}
