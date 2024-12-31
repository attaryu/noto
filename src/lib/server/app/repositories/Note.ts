import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteInDTO } from '$lib/server/domain/dtos/Note/NoteIn';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { IPagination } from '$lib/server/domain/dtos/Pagination';

export interface INoteFilter {
	offset?: number;
	label?: string;
	search?: string[];
	archived?: boolean;
}

export interface INoteOutPagination {
	data: INoteOutDTO[];
	metadata: IPagination;
}

export interface INoteRepository {
	create(data: ICreateNoteDTO): Promise<INoteInDTO>;
	findById(id: string): Promise<INoteInDTO | null>;
	findByFilter(userId: string, filter: INoteFilter): Promise<INoteOutPagination>;
}
