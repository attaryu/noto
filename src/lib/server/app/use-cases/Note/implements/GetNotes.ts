import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { INoteOutDTO } from '$lib/server/domain/dtos/Note/NoteOut';
import type { IWithMetadata } from '$lib/server/domain/dtos/Pagination';
import type { IGetNotes, IGetNotesFilter } from '../GetNotes';

export class GetNotes implements IGetNotes {
	constructor(private readonly noteRepository: INoteRepository) {}

	async execute(userId: string, query: IGetNotesFilter): Promise<IWithMetadata<INoteOutDTO[]>> {
		const notes = await this.noteRepository.findByFilter(userId, query);

		return {
			data: notes.data.map(({ deletedAt, createdAt, userId, ...note }) => note),
			metadata: notes.metadata,
		};
	}
}
