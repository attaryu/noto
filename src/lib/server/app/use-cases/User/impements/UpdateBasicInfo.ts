import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IUpdateUserBasicDTO } from '$lib/server/domain/dtos/User/UpdateUserBasic';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';
import type { IUpdateBasicInfo } from '../UpdateBasicInfo';

import { UserEntity } from '$lib/server/domain/entities/user';
import { UserError } from '$lib/server/domain/errors/User';

export class UpdateBasicInfo implements IUpdateBasicInfo {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(id: string, payload: IUpdateUserBasicDTO): Promise<IUserOutDTO> {
		const existingUser = await this.userRepository.findById(id);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		if (payload.email) {
			const existingEmail = await this.userRepository.findByEmail(payload.email);

			if (existingEmail && existingEmail.id !== id) {
				throw new UserError.AlreadyExist();
			}
		}

		const userEntity = new UserEntity(existingUser);
		userEntity.update(payload);

		await this.userRepository.update(userEntity.id!, {
			fullname: userEntity.fullname,
			email: userEntity.email,
		});

		return userEntity.toObject();
	}
}
