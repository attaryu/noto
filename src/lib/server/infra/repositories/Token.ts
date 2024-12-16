import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { ITokenDTO } from '$lib/server/domain/dtos/Token/Token';
import type { TokenInterface } from '$lib/server/domain/entities/token';

import { ObjectId, type Collection, type MongoClient } from 'mongodb';

type Document = TokenInterface;

export class TokenRepository implements ITokenRepository {
	private readonly client: MongoClient;
	private readonly database: Collection<Document>;

	constructor(client: MongoClient) {
		this.client = client;
		this.database = client.db('noto').collection<Document>('tokens');
	}

	async create(data: ITokenDTO): Promise<ITokenDTO | null> {
		const result = await this.database.insertOne({ ...data });
		const session = await this.getSessionById(result.insertedId.toString());

		return session;
	}

	async getSessionById(id: string): Promise<ITokenDTO | null> {
		const result = await this.database.findOne({ _id: new ObjectId(id) });
		return result;
	}

	async getSessionByToken(token: string): Promise<ITokenDTO | null> {
		const result = await this.database.findOne({ token });
		return result;
	}

	async delete(token: string): Promise<void> {
		await this.database.deleteOne({ token });
	}
}
