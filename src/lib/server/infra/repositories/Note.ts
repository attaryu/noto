import type { Collection, Filter, MongoClient } from 'mongodb';

import type {
	INoteFilter,
	INoteOutPagination,
	INoteRepository,
} from '$lib/server/app/repositories/Note';
import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteInDTO } from '$lib/server/domain/dtos/Note/NoteIn';

import { ObjectId } from 'mongodb';
import type { IUpdateNoteDTO } from '$lib/server/domain/dtos/Note/UpdateNote';

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
		const data = await this.database.findOne({ _id: new ObjectId(id) });

		if (data) {
			const { _id, ...restData } = data;

			return {
				id,
				...restData,
			};
		}

		return null;
	}

	async findByFilter(userId: string, filter: INoteFilter): Promise<INoteOutPagination> {
		const { offset = 0, archived = false, label, search } = filter;
		const query: Filter<Document> = {
			userId,
			archived,
			...(label && { labels: { $in: [label] } }),
			...(search && { indexedWords: { $in: search } }),
		};

		const limit = 10;
		const total = await this.database.countDocuments(query);

		if (offset === total) {
			return {
				data: [],
				metadata: { limit, offset, total },
			};
		}

		const notes = await this.database
			.find(query)
			.sort({ updatedAt: -1, _id: -1 })
			.skip(offset)
			.limit(limit)
			.toArray();

		return {
			metadata: {
				offset: offset + notes.length,
				total,
				limit,
			},

			// ? transforming objectId _id to string id
			data: notes.map(({ _id, ...note }) => ({ id: _id.toString(), ...note })),
		};
	}

	async update(id: string, data: IUpdateNoteDTO): Promise<INoteInDTO> {
		await this.database.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { ...data, updatedAt: new Date() } },
		);

		const note = await this.findById(id);

		return note!;
	}
}
