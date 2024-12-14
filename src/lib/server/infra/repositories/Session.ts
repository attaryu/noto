import type { ISessionRepository } from '$lib/server/app/repositories/Session';
import type { ICreateSessionDTO } from '$lib/server/domain/dtos/Session/CreateSession';
import type { ISessionDTO } from '$lib/server/domain/dtos/Session/Session';
import type { SessionInterface } from '$lib/server/domain/entities/session';

import { ObjectId, type Collection, type MongoClient } from 'mongodb';

type Document = SessionInterface;

export class SessionRepository implements ISessionRepository {
	private readonly client: MongoClient;
	private readonly database: Collection<Document>;

	constructor(client: MongoClient) {
		this.client = client;
		this.database = client.db('noto').collection<Document>('sessions');
	}

	async create(data: ICreateSessionDTO): Promise<ISessionDTO | null> {
		const result = await this.database.insertOne({ ...data });
		const session = await this.getSessionById(result.insertedId.toString());

		return session;
	}

	async getSessionById(id: string): Promise<ISessionDTO | null> {
		const result = await this.database.findOne({ _id: new ObjectId(id) });
		return result;
	}

	async getSessionByToken(token: string): Promise<ISessionDTO | null> {
		const result = await this.database.findOne({ token });
		return result;
	}

	async delete(token: string): Promise<void> {
		console.log(token);
		await this.database.deleteOne({ token });
	}
}
