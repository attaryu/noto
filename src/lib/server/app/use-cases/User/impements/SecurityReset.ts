import type { IPasswordHasher } from '$lib/server/app/providers/PasswordHasher';
import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IUpdateUserDTO } from '$lib/server/domain/dtos/User/UpdateUser';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';
import type { ISecurityReset } from '../SecurityReset';

import { UserEntity } from '$lib/server/domain/entities/user';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenError } from '$lib/server/domain/errors/Token';
import { UserError } from '$lib/server/domain/errors/User';

export class SecurityReset implements ISecurityReset {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly tokenRepository: ITokenRepository,
		private readonly tokenManager: ITokenManager,
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(token: string, security: IUpdateUserDTO): Promise<IUserOutDTO> {
		const tokenPayload = await this.tokenManager.verify(token);

		if (tokenPayload.purpose !== TokenPurposeEnum.resetPassword) {
			throw new TokenError.Purpose();
		}

		const existingToken = await this.tokenRepository.getSessionByToken(token);

		if (!existingToken) {
			throw new TokenError.NotRegistered();
		}

		const existingUser = await this.userRepository.findById(tokenPayload.userId);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		const user = new UserEntity(existingUser);

		user.update({
			...security,
			password: {
				...security.password!,
				value: await this.passwordHasher.hash(security.password!.value),
			},
		});

		// manual transaction
		try {
			await this.userRepository.update(user.id!, user.toObject());
			await this.tokenRepository.delete({ userId: user.id });
		} catch (error) {
			await this.userRepository.update(existingUser.id!, existingUser);
			throw error;
		}

		return {
			id: user.id,
			fullname: user.fullname,
			email: user.email,
		};
	}
}
