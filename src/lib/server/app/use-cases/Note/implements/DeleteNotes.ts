import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IDeleteNotes } from '../DeleteNotes';

export class DeleteNotes implements IDeleteNotes {
	constructor(private readonly noteRepository: INoteRepository) {}

	async execute(noteId: string[], userId: string): Promise<void> {
		await this.noteRepository.deleteMany(noteId, userId);
	}
}
