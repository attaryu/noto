import type { ILabelRepository } from '$lib/server/app/repositories/Label';
import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { ICreateNote } from '../CreateNote';

import { LabelEntity } from '$lib/server/domain/entities/label';
import { NoteEntity } from '$lib/server/domain/entities/note';
import { UserError } from '$lib/server/domain/errors/User';

export class CreateNote implements ICreateNote {
	constructor(
		private readonly noteRepository: INoteRepository,
		private readonly userRepository: IUserRepository,
		private readonly labelRepository: ILabelRepository,
	) {}

	async execute(newNote: ICreateNoteDTO): Promise<INoteOutDTO> {
		const existingUser = await this.userRepository.findById(newNote.userId);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		const labelsFromDatabase = await this.labelRepository.finds({
			userId: newNote.userId,
			label: newNote.labels,
		});

		/**
		 * Transformed label, from name to id
		 */
		const newLabelIds = await Promise.all(
			newNote.labels.map(async (name) => {
				/**
				 * Label data from database by name
				 */
				const existingLabel = labelsFromDatabase.find((label) => label.name === name);

				if (existingLabel) {
					const labelEntity = new LabelEntity(existingLabel);
					labelEntity.increaseUsage();

					await this.labelRepository.update(labelEntity.id, { used: labelEntity.used });

					return labelEntity.id;
				}

				const labelEntity = LabelEntity.create({ name, userId: newNote.userId });
				const newLabel = await this.labelRepository.create({ name, userId: labelEntity.userId });

				return newLabel.id;
			}),
		);

		const noteEntity = NoteEntity.create({ ...newNote, labels: newLabelIds });

		const { deletedAt, updatedAt, userId, ...note } = await this.noteRepository.create({
			iv: noteEntity.iv,
			content: noteEntity.content,
			indexedWords: noteEntity.indexedWords,
			labels: newLabelIds,
			userId: noteEntity.userId,
		});

		return note;
	}
}
