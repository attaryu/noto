import type { IPagination } from '$lib/server/domain/dtos/Pagination';
import type { INoteOutDTO } from '../../../domain/dtos/Note/NoteOut';

export interface IGetNotesFilter {
	offset?: number;
	label?: string;
	search?: string[];
	archived?: boolean;
}

export interface INoteOutPagination {
	data: INoteOutDTO[];
	metadata: IPagination;
}

export interface IGetNotes {
	execute(userId: string, query: IGetNotesFilter): Promise<INoteOutPagination>;
}
