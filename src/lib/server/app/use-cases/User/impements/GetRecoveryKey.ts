import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IGetRecoveryKey, IGetRecoveryKeyDTO } from '../GetRecoveryKey';

import { TokenEntity } from '$lib/server/domain/entities/token';
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

		const existingUser = await this.userRepository.findById(tokenPayload.id);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		const recoveryKey = existingUser.recoveryKeys.find(({ code }) => code === keyOrder);

		if (!recoveryKey) {
			throw new UserError.RecoveryKeyNotFound();
		}

		const resetPasswordToken = await this.tokenManager.sign({
			email: existingUser.email,
			id: existingUser.id,
			purpose: TokenPurposeEnum.resetPassword,
			fullname: existingUser.fullname,
		});

		const tokenEntity = TokenEntity.create({
			userId: existingUser.id,
			purpose: resetPasswordToken.purpose,
			expiredAt: resetPasswordToken.expired,
			token: resetPasswordToken.value,
		}).toObject();

		// delete email recovery token
		await this.tokenRepository.delete({ token: existingToken.token });

		// delete old reset password token if exist
		await this.tokenRepository.delete({
			userId: existingUser.id,
			purpose: TokenPurposeEnum.resetPassword,
		});

		// store new reset password token
		await this.tokenRepository.create(tokenEntity);

		return {
			token: {
				value: resetPasswordToken.value,
				expiredAt: resetPasswordToken.expired,
			},
			recoveryKey,
		};
	}
}
