import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';
import type { IGetUser } from '../GetUser';

import { UserEntity } from '$lib/server/domain/entities/user';
import { UserError } from '$lib/server/domain/errors/User';

export class GetUser implements IGetUser {
	constructor(private readonly userRepository: IUserRepository) {}

	public async execute(id: string): Promise<IUserOutDTO> {
		const existingUser = await this.userRepository.findById(id);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		const { recoveryKeys, password, ...user } = new UserEntity(existingUser).toObject();

		return user;
	}
}
