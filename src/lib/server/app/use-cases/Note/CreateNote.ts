import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';

export interface ICreateNote {
	execute(newNote: ICreateNoteDTO): Promise<INoteOutDTO>;
}
