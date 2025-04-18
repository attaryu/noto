import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { IGetNotes, IGetNotesFilter, INoteOutPagination } from '../GetNotes';

import { NoteError } from '$lib/server/domain/errors/Note';

export class GetNotes implements IGetNotes {
	private limit = 10;

	constructor(private readonly noteRepository: INoteRepository) {}

	async execute(userId: string, query: IGetNotesFilter): Promise<INoteOutPagination> {
		const count = await this.noteRepository.count({ ...query, userId });

		if (query.offset && query.offset >= count) {
			throw new NoteError.AmountExceeded();
		}

		const notes = await this.noteRepository.findManyByFilter({
			...query,
			limit: this.limit,
			userId,
		});

		return {
			data: notes.map(({ deletedAt, createdAt, userId, ...note }) => note),
			metadata: {
				limit: 10,
				offset: notes.length + (query.offset ?? 0),
				total: count,
			},
		};
	}
}
