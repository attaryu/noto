import type { INoteRepository } from '$lib/server/app/repositories/Note';
import type { ICreateNoteDTO } from '$lib/server/domain/dtos/Note/CreateNote';
import type { INoteInDTO } from '$lib/server/domain/dtos/Note/NoteIn';
import type { Collection, MongoClient } from 'mongodb';

import { ObjectId } from 'mongodb';

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
			return {
				id: data._id.toString(),
				...data,
			};
		}

		return null;
	}
}
