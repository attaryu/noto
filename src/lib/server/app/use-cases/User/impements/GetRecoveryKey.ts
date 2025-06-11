import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IGetRecoveryKey, IGetRecoveryKeyDTO } from '../GetRecoveryKey';

import { TokenEntity } from '$lib/server/domain/entities/token';
import { UserEntity } from '$lib/server/domain/entities/user';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenError } from '$lib/server/domain/errors/Token';
import { UserError } from '$lib/server/domain/errors/User';

export class GetRecoveryKey implements IGetRecoveryKey {
	constructor(
		private readonly tokenRepository: ITokenRepository,
		private readonly userRepository: IUserRepository,
		private readonly tokenManager: ITokenManager,
	) {}

	async execute(token: string, keyOrder: string): Promise<IGetRecoveryKeyDTO> {
		const tokenPayload = await this.tokenManager.verify(token);

		if (tokenPayload.purpose !== TokenPurposeEnum.recoveryEmail) {
			throw new TokenError.Purpose();
		}

		const existingToken = await this.tokenRepository.getSessionByToken(token);

		if (!existingToken) {
			throw new TokenError.NotRegistered();
		}

		const existingUser = await this.userRepository.findById(existingToken.userId);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		const userEntity = new UserEntity(existingUser);
		const recoveryKey = userEntity.recoveryKeys.find(({ code }) => code === keyOrder);

		if (!recoveryKey) {
			throw new UserError.RecoveryKeyIncorrect();
		}

		const resetPasswordToken = await this.tokenManager.sign({
			purpose: TokenPurposeEnum.resetPassword,
			userId: userEntity.id!,
		});

		const tokenEntity = TokenEntity.create({
			userId: userEntity.id!,
			purpose: resetPasswordToken.purpose,
			expiredAt: resetPasswordToken.expired,
			token: resetPasswordToken.value,
		}).toObject();

		// delete old reset password token if exist
		await this.tokenRepository.delete({
			userId: userEntity.id!,
			purpose: TokenPurposeEnum.resetPassword,
		});

		// store new reset password token
		await this.tokenRepository.create(tokenEntity);

		return {
			token: {
				value: tokenEntity.token,
				expiredAt: tokenEntity.expiredAt,
			},
			recoveryKey,
		};
	}
}
