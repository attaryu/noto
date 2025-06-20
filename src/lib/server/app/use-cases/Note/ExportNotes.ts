import type { ILabelOutDTO } from '$lib/server/domain/dtos/Label/LabelOut';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';

export interface IExportBackupReturn {
	notes: INoteOutDTO[];
	labels: ILabelOutDTO[];
}

export interface IExportBackup {
	execute(userId: string): Promise<IExportBackupReturn>;
}
