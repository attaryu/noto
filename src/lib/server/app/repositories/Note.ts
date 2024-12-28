import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteInDTO } from '$lib/server/domain/dtos/Note/NoteIn';

export interface INoteRepository {
	create(data: ICreateNoteDTO): Promise<INoteInDTO>;
	findById(id: string): Promise<INoteInDTO | null>;
}
