import type { IPasswordHasher } from '$lib/server/app/providers/PasswordHasher';
import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IUpdateUserDTO } from '$lib/server/domain/dtos/User/UpdateUser';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';
import type { ISecurityReset } from '../SecurityReset';

import { UserEntity } from '$lib/server/domain/entities/user';
import { TokenNotRegisteredError } from '$lib/server/domain/errors/Token/TokenNotRegisteredError';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';

export class SecurityReset implements ISecurityReset {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly tokenRepository: ITokenRepository,
		private readonly tokenManager: ITokenManager,
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(token: string, security: IUpdateUserDTO): Promise<IUserOutDTO> {
		const tokenPayload = await this.tokenManager.verify(token);
		const existingToken = await this.tokenRepository.getSessionByToken(token);

		if (!existingToken) {
			throw new TokenNotRegisteredError();
		}

		const existingUser = await this.userRepository.findById(tokenPayload.id);

		if (!existingUser) {
			throw new UserNotFoundError();
		}

		const userEntity = UserEntity.update(security);

		await this.userRepository.update(existingUser.id, {
			...userEntity,
			password: {
				...userEntity.password!,
				value: await this.passwordHasher.hash(userEntity.password!.value),
			},
		});

		// manual transaction
		try {
			await this.tokenRepository.delete({ userId: existingUser.id });
		} catch (error) {
			await this.userRepository.update(existingUser.id, existingUser);
			throw error;
		}

		return {
			id: existingUser.id,
			fullname: existingUser.fullname,
			email: existingUser.email,
		};
	}
}
