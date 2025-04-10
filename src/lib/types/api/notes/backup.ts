import type { IResponseAPI } from '$lib/types/response';
import type { INote } from '.';

interface INoteBackup extends INote {
	index: string[];
}

export type IExportNotesResponse = IResponseAPI<{ backup: IImportNotesPayload }>;

export type IImportNotesPayload = {
	notes: INoteBackup[];

	/**
	 * Label feature not implemented yet
	 */
	labels: any;
};

export type IImportNotesResponse = IResponseAPI;
