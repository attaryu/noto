import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { ICreateUserDTO } from '$lib/server/domain/dtos/User/CreateUser';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';
import type { ICreateUser } from '../CreateUser';

import { UserEntity } from '$lib/server/domain/entities/user';
import { UserCircle } from 'lucide-svelte';
import { UserAlreadyExistError } from '$lib/server/domain/errors/User/UserAlreadyExistError';

export class CreateUser implements ICreateUser {
	constructor(private userRepository: IUserRepository) {}

	async execute(data: ICreateUserDTO): Promise<IUserOutDTO> {
		const newUser = UserEntity.create(data);

		const isEmailAlreadyExist = await this.userRepository.findByEmail(newUser.email);

		if (isEmailAlreadyExist) {
			throw new UserAlreadyExistError(newUser.email);
		}

		const user = await this.userRepository.create(data);

		if (!user) {
			throw Error('Something error');
		}

		return {
			id: user.id,
			email: user.email,
			fullname: user.fullname,
		};
	}
}
