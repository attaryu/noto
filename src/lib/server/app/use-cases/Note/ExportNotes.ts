import type { ILabelOutDTO } from '$lib/server/domain/dtos/Label/LabelOut';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';

export interface IExportNotesReturn {
	notes: INoteOutDTO[];
	labels: ILabelOutDTO[];
}

export interface IExportNotes {
	execute(userId: string): Promise<IExportNotesReturn>;
}
