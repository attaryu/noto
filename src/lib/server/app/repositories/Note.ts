import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteInDTO } from '$lib/server/domain/dtos/Note/NoteIn';
import type { IUpdateNoteDTO } from '$lib/server/domain/dtos/Note/UpdateNote';

export interface INoteFilter {
	offset?: number;
	label?: string;
	search?: string[];
	archived?: boolean;
	userId?: string;
	limit?: number;
	noteId?: string[];
	deleted?: boolean;
}

export interface INoteRepository {
	create(data: ICreateNoteDTO): Promise<INoteInDTO>;
	update(id: string, data: IUpdateNoteDTO): Promise<INoteInDTO>;
	findById(id: string): Promise<INoteInDTO | null>;
	findManyByFilter(filter: INoteFilter): Promise<INoteInDTO[]>;
	count(filter: INoteFilter): Promise<number>;
	softDeletes(noteId: string[], userId: string): Promise<void>;
	hardDeletes(noteId: string[], userId: string): Promise<void>;
}
