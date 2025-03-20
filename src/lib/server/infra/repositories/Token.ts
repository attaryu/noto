import type { Collection, MongoClient } from 'mongodb';

import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { ITokenInDTO } from '$lib/server/domain/dtos/Token/TokenIn';
import type { TokenInterface } from '$lib/server/domain/entities/token';

import { objectId } from '../helper/objectId';

type Document = TokenInterface;

export class TokenRepository implements ITokenRepository {
	private readonly client: MongoClient;
	private readonly database: Collection<Document>;

	constructor(client: MongoClient) {
		this.client = client;
		this.database = client.db('noto').collection<Document>('tokens');
	}

	async create(data: ITokenInDTO): Promise<ITokenInDTO | null> {
		const result = await this.database.insertOne({ ...data });
		const token = await this.getSessionById(result.insertedId.toString());

		return token;
	}

	async getSessionById(id: string): Promise<ITokenInDTO | null> {
		const result = await this.database.findOne({ _id: objectId(id) });
		return result;
	}

	async getSessionByToken(token: string): Promise<ITokenInDTO | null> {
		const result = await this.database.findOne({ token });
		return result;
	}

	async delete(query: Partial<ITokenInDTO>): Promise<void> {
		await this.database.deleteMany({ ...query });
	}
}
