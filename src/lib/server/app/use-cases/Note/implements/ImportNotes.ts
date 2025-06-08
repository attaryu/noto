import type { ILabelRepository } from '$lib/server/app/repositories/Label';
import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IExportBackupReturn } from '../ExportNotes';
import type { IImportBackup } from '../ImportNotes';

import { UserError } from '$lib/server/domain/errors/User';

export class ImportNotes implements IImportBackup {
	constructor(
		private readonly noteRepository: INoteRepository,
		private readonly labelRepository: ILabelRepository,
		private readonly userRepository: IUserRepository,
	) {}

	async execute(backup: IExportBackupReturn, userId: string): Promise<void> {
		const existingUser = await this.userRepository.findById(userId);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		if (backup.notes.length) {
			await this.noteRepository.replaceAll(backup.notes, userId);
		}

		if (backup.labels.length) {
			await this.labelRepository.replaceAll(backup.labels, userId);
		}
	}
}
