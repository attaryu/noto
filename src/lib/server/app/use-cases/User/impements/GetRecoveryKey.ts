import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IGetRecoveryKey, IGetRecoveryKeyDTO } from '../GetRecoveryKey';

import { TokenEntity } from '$lib/server/domain/entities/token';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenNotRegisteredError } from '$lib/server/domain/errors/Token/TokenNotRegisteredError';
import { TokenPurposeError } from '$lib/server/domain/errors/Token/TokenPurposeError';
import { RecoveryKeyNotFoundError } from '$lib/server/domain/errors/User/RecoverKeyNotFoundError';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';

export class GetRecoveryKey implements IGetRecoveryKey {
	constructor(
		private readonly tokenRepository: ITokenRepository,
		private readonly userRepository: IUserRepository,
		private readonly tokenManager: ITokenManager,
	) {}

	async execute(token: string, keyOrder: string): Promise<IGetRecoveryKeyDTO> {
		const payload = await this.tokenManager.verify(token);

		if (payload.purpose !== TokenPurposeEnum.recoveryEmail) {
			throw new TokenPurposeError();
		}

		const emailRecoveryToken = await this.tokenRepository.getSessionByToken(token);

		if (!emailRecoveryToken) {
			throw new TokenNotRegisteredError();
		}

		const existingUser = await this.userRepository.findById(payload.id);

		if (!existingUser) {
			throw new UserNotFoundError();
		}

		const recoveryKey = existingUser.recoveryKeys[keyOrder];

		if (!recoveryKey) {
			throw new RecoveryKeyNotFoundError(keyOrder);
		}

		const resetPasswordToken = await this.tokenManager.sign({
			email: existingUser.email,
			id: existingUser.id,
			purpose: TokenPurposeEnum.resetPassword,
		});

		const tokenEntity = TokenEntity.create({
			userId: existingUser.id,
			purpose: resetPasswordToken.purpose,
			expiredAt: resetPasswordToken.expired,
			token: resetPasswordToken.value,
		}).toObject();

		// delete email recovery token
		await this.tokenRepository.delete({ token: emailRecoveryToken.token });

		// delete old reset password token if exist
		await this.tokenRepository.delete({
			userId: existingUser.id,
			purpose: TokenPurposeEnum.resetPassword,
		});

		// store new reset password token
		await this.tokenRepository.create(tokenEntity);

		return {
			token: resetPasswordToken.value,
			recoveryKey,
		};
	}
}
