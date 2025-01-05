import type { IPasswordHasher } from '$lib/server/app/providers/PasswordHasher';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { ICreateUserDTO } from '$lib/server/domain/dtos/User/CreateUser';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';
import type { ICreateUser } from '../CreateUser';

import { UserEntity } from '$lib/server/domain/entities/user';
import { UserError } from '$lib/server/domain/errors/User';

export class CreateUser implements ICreateUser {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(data: ICreateUserDTO): Promise<IUserOutDTO> {
		const newUser = UserEntity.create({
			...data,
			password: {
				...data.password,
				value: await this.passwordHasher.hash(data.password.value),
			},
		});

		const isEmailAlreadyExist = await this.userRepository.findByEmail(newUser.email!);

		if (isEmailAlreadyExist) {
			throw new UserError.AlreadyExist();
		}

		const user = await this.userRepository.create({
			email: newUser.email!,
			fullname: newUser.fullname!,
			password: newUser.password!,
			recoveryKeys: newUser.recoveryKeys!,
			secretKey: newUser.secretKey!,
		});

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
