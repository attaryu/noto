import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IDeleteNotes } from '../DeleteNotes';
import type { ILabelRepository } from '$lib/server/app/repositories/Label';

import { NoteEntity } from '$lib/server/domain/entities/note';
import { NoteError } from '$lib/server/domain/errors/Note';
import { LabelEntity } from '$lib/server/domain/entities/label';

export class DeleteNotes implements IDeleteNotes {
	constructor(
		private readonly noteRepository: INoteRepository,
		private readonly labelRepository: ILabelRepository,
	) {}

	async execute(noteId: string[], userId: string): Promise<void> {
		const existingNotes = await this.noteRepository.findManyByFilter({ noteId });
		const existingLabels = await this.labelRepository.finds({ userId });

		if (!existingNotes.length) {
			throw new NoteError.NotFound();
		}

		for (const existingNote of existingNotes) {
			const note = new NoteEntity(existingNote);

			if (!note.isOwnedBy(userId)) {
				throw new NoteError.UnauthorizedOwner();
			}

			if (note.isDeleted) {
				throw new NoteError.AlreadyDeleted(note.id);
			}

			// deleting or decreasing usage of labels
			await Promise.all(
				note.labels.map(async (labelId) => {
					const label = existingLabels.find(({ id }) => id === labelId)!;
					const labelEntity = new LabelEntity(label);

					labelEntity.decreaseUsage();

					if (labelEntity.isUnused) {
						await this.labelRepository.delete(labelEntity.id);
					} else {
						await this.labelRepository.update(labelEntity.id, labelEntity.toObject());
					}
				}),
			);
		}

		await this.noteRepository.softDeletes(noteId, userId);
	}
}
