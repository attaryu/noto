import type { IWithMetadata } from '$lib/server/domain/dtos/Pagination';
import type { INoteOutDTO } from '../../../domain/dtos/Note/NoteOut';
import type { INoteFilter } from '../../repositories/Note';

export type IGetNotesFilter = Omit<INoteFilter, 'archived'>;

export interface IGetNotes {
	execute(userId: string, query: IGetNotesFilter): Promise<IWithMetadata<INoteOutDTO[]>>;
}
