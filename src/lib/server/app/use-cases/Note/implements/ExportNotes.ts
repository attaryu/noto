import type { ILabelRepository } from '$lib/server/app/repositories/Label';
import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IExportNotes, IExportNotesReturn } from '../ExportNotes';

import { UserError } from '$lib/server/domain/errors/User';

export class ExportNotes implements IExportNotes {
	constructor(
		private readonly noteRepository: INoteRepository,
		private readonly labelRepository: ILabelRepository,
		private readonly userRepository: IUserRepository,
	) {}

	async execute(userId: string): Promise<IExportNotesReturn> {
		const existingUser = await this.userRepository.findById(userId);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		const labels = await this.labelRepository.finds({ userId });

		const notes = await this.noteRepository.findManyByFilter({
			userId,
			deleted: false,
		});

		return {
			notes: notes.map(({ userId, deletedAt, ...note }) => note),
			labels: labels.map(({ userId, ...label }) => label),
		};
	}
}
