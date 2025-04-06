import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { IUpdateNoteDTO } from '$lib/server/domain/dtos/Note/UpdateNote';

export interface IUpdateNote {
	execute(userId: string, noteId: string, payload: IUpdateNoteDTO): Promise<INoteOutDTO>;
}
