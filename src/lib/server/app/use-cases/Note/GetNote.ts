import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';

export interface IGetNote {
  execute(userId: string, noteId: string): Promise<INoteOutDTO>;
}
