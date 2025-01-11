import type { ILabelRepository } from '$lib/server/app/repositories/Label';
import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { IUpdateNoteDTO } from '$lib/server/domain/dtos/Note/UpdateNote';
import type { IUpdateNote } from '../UpdateNote';

import { LabelEntity } from '$lib/server/domain/entities/label';
import { NoteEntity } from '$lib/server/domain/entities/note';
import { NoteError } from '$lib/server/domain/errors/Note';

export class UpdateNote implements IUpdateNote {
	constructor(
		private readonly noteRepository: INoteRepository,
		private readonly labelRepository: ILabelRepository,
	) {}

	async execute(
		userId: string,
		noteId: string,
		optionalNote: IUpdateNoteDTO,
	): Promise<INoteOutDTO> {
		const existingNote = await this.noteRepository.findById(noteId);

		if (!existingNote) {
			throw new NoteError.NotFound();
		}

		const noteEntity = new NoteEntity(existingNote);

		if (!noteEntity.isOwnedBy(userId)) {
			throw new NoteError.UnauthorizedOwner();
		}

		// ------------------------- label processing -------------------------

		/**
		 * Label names from request
		 */
		const labelsFromRequest = optionalNote.labels;

		/**
		 * Label ids after processing all label names
		 */
		let processedLabels: string[] = [];

		if (labelsFromRequest) {
			/**
			 * All user labels from database
			 */
			const labelFromDatabase = await this.labelRepository.finds({ userId: noteEntity.userId });

			processedLabels = await Promise.all(
				labelsFromRequest.map(async (name) => {
					/**
					 * Checking existing label from database by name
					 */
					const existingLabel = labelFromDatabase.find((label) => label.name === name);

					if (!existingLabel) {
						const labelEntity = LabelEntity.create({ name, userId: noteEntity.userId });
						const newLabel = await this.labelRepository.create(labelEntity);

						return newLabel.id;
					}

					/**
					 * Determining the new label id is not in the original note label
					 */
					const isNewLabel = !noteEntity.labels.includes(existingLabel.id);

					if (isNewLabel) {
						const labelEntity = new LabelEntity(existingLabel);
						labelEntity.increaseUsage();

						await this.labelRepository.update(labelEntity.id, labelEntity);

						return labelEntity.id;
					}

					/**
					 * Return label id from the original note label
					 */
					return existingLabel.id;
				}),
			);

			/**
			 * The labels to be deleted from the original note.
			 * Obtained from determining the label id is on the original note but not in the new label id
			 */
			const removedLabel = labelFromDatabase.filter(
				({ id }) => noteEntity.labels.includes(id) && !processedLabels.includes(id),
			);

			await Promise.all(
				removedLabel.map(async (label) => {
					const labelEntity = new LabelEntity(label);
					labelEntity.decreaseUsage();

					if (labelEntity.isUnused) {
						await this.labelRepository.delete(labelEntity.id);
					} else {
						await this.labelRepository.update(labelEntity.id, labelEntity);
					}
				}),
			);
		}

		// --------------------------------------------------------------------

		const noteEntityUpdate = noteEntity.update({
			...optionalNote,
			...(labelsFromRequest && { labels: processedLabels }),
		});

		const {
			deletedAt,
			createdAt,
			userId: _userId,
			...updatedNote
		} = await this.noteRepository.update(noteId, noteEntityUpdate);

		return updatedNote;
	}
}
