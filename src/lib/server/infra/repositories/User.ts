import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { ICreateUserDTO } from '$lib/server/domain/dtos/User/CreateUser';
import type { IUpdateUserDTO } from '$lib/server/domain/dtos/User/UpdateUser';
import type { IUserInDTO } from '$lib/server/domain/dtos/User/UserIn';
import type { UserInterface } from '$lib/server/domain/entities/user';

import { ObjectId, type Collection, type MongoClient } from 'mongodb';

type Document = Omit<UserInterface, 'id'>;

export class UserRepository implements IUserRepository {
	private readonly client: MongoClient;
	private readonly database: Collection<Document>;

	constructor(client: MongoClient) {
		this.client = client;
		this.database = client.db('noto').collection<Document>('users');
	}

	async create(data: ICreateUserDTO): Promise<IUserInDTO | null> {
		const now = new Date();

		const result = await this.database.insertOne({
			createdAt: now,
			updateAt: now,
			...data,
		});

		const user = await this.findById(result.insertedId.toString());

		return user;
	}

	async findById(id: string): Promise<IUserInDTO | null> {
		const data = await this.database.findOne({ _id: new ObjectId(id) });

		if (data) {
			return {
				id: data._id.toString(),
				...data,
			};
		}

		return null;
	}

	async findByEmail(email: string): Promise<IUserInDTO | null> {
		const data = await this.database.findOne({ email });

		if (data) {
			return {
				id: data._id.toString(),
				...data,
			};
		}

		return null;
	}

	async update(id: string, data: IUpdateUserDTO): Promise<IUserInDTO | null> {
		await this.database.updateOne({ _id: new ObjectId(id) }, { $set: data });
		const updatedUser = await this.findById(id);

		return updatedUser;
	}
}
