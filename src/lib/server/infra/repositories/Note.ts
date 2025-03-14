import type { Collection, Filter, MongoClient } from 'mongodb';

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

	private transformFilter(filter: INoteFilter): Filter<Document> {
		const { archived, noteId, label, search, userId, deleted } = filter;

		return {
			userId,
			archived,
			deletedAt: deleted ? { $ne: null } : null,
			...(noteId && { _id: { $in: noteId.map((id) => objectId(id)) } }),
			...(label && { labels: { $in: [label] } }),
			...(search && { index: { $all: search } }),
		};
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
		const cursor = this.database
			.find(this.transformFilter(filter), { ignoreUndefined: true })
			.sort({ pinned: -1, updatedAt: -1, _id: -1 })
			.skip(filter.offset ?? 0);

		if (filter.limit) {
			cursor.limit(filter.limit);
		}

		const notes = await cursor.toArray();

		// ? transforming _id [objectId] to id [string]
		return notes.map(({ _id, ...note }) => ({ id: _id.toString(), ...note }));
	}

	async count(filter: INoteFilter): Promise<number> {
		return await this.database.countDocuments(this.transformFilter(filter));
	}

	async update(id: string, data: IUpdateNoteDTO): Promise<INoteInDTO> {
		await this.database.updateOne(
			{ _id: objectId(id) },
			{ $set: { ...data, updatedAt: new Date() } },
		);

		const note = await this.findById(id);

		return note!;
	}

	async softDeletes(noteId: string[], userId: string): Promise<void> {
		const now = new Date();

		await this.database.updateMany(
			{ _id: { $in: noteId.map((id) => objectId(id)) }, userId },
			{ $set: { deletedAt: now, labels: [] } },
		);
	}

	async hardDeletes(noteId: string[], userId: string): Promise<void> {
		this.database.deleteMany({
			_id: { $in: noteId.map((id) => objectId(id)) },
			userId,
		});
	}
}
