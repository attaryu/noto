import type { Collection, MongoClient } from 'mongodb';

import type { INoteFilter, INoteRepository } from '$lib/server/app/repositories/Note';
import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteInDTO } from '$lib/server/domain/dtos/Note/NoteIn';
import type { IUpdateNoteDTO } from '$lib/server/domain/dtos/Note/UpdateNote';

import { objectId } from '../helper/objectId';

export type Document = Omit<INoteInDTO, 'id'>;

export class NoteRepository implements INoteRepository {
	private readonly client: MongoClient;
	private readonly database: Collection<Document>;

	constructor(client: MongoClient) {
		this.client = client;
		this.database = client.db('noto').collection<Document>('notes');
	}

	async create(data: ICreateNoteDTO): Promise<INoteInDTO> {
		const now = new Date();

		const result = await this.database.insertOne({
			...data,
			pinned: false,
			archived: false,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		});

		const note = await this.findById(result.insertedId.toString());

		return note!;
	}

	async findById(id: string): Promise<INoteInDTO | null> {
		const data = await this.database.findOne({ _id: objectId(id) });

		if (data) {
			const { _id, ...restData } = data;

			return {
				id,
				...restData,
			};
		}

		return null;
	}

	async findManyByFilter(filter: INoteFilter): Promise<INoteInDTO[]> {
		const { offset = 0, archived = false, limit = 100, label, search, userId } = filter;

		const notes = await this.database
			.find({
				userId,
				archived,
				...(label && { labels: { $in: [label] } }),
				...(search && { indexedWords: { $in: search } }),
			})
			.sort({ updatedAt: -1, _id: -1 })
			.skip(offset)
			.limit(limit)
			.toArray();

		// ? transforming _id [objectId] to id [string]
		return notes.map(({ _id, ...note }) => ({ id: _id.toString(), ...note }));
	}

	async count(filter: INoteFilter): Promise<number> {
		const { archived = false, label, search, userId } = filter;

		return await this.database.countDocuments({
			userId,
			archived,
			...(label && { labels: { $in: [label] } }),
			...(search && { indexedWords: { $in: search } }),
		});
	}

	async update(id: string, data: IUpdateNoteDTO): Promise<INoteInDTO> {
		await this.database.updateOne(
			{ _id: objectId(id) },
			{ $set: { ...data, updatedAt: new Date() } },
		);

		const note = await this.findById(id);

		return note!;
	}

	async deleteMany(noteId: string[], userId: string): Promise<void> {
		this.database.deleteMany({
			_id: { $in: noteId.map((id) => objectId(id)) },
			userId,
		});
	}
}
