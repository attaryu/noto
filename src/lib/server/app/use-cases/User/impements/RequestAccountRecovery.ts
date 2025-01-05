import type { IEmailSender } from '$lib/server/app/providers/EmailSender';
import type { IEmailTemplate } from '$lib/server/app/providers/EmailTemplate';
import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IRequestAccountRecovery } from '../RequestAccountRecovery';

import { TokenEntity } from '$lib/server/domain/entities/token';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { UserError } from '$lib/server/domain/errors/User';

export class RequestAccountRecovery implements IRequestAccountRecovery {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly tokenRepository: ITokenRepository,
		private readonly emailSender: IEmailSender,
		private readonly emailTemplate: IEmailTemplate,
		private readonly tokenManager: ITokenManager,
	) {}

	async execute(email: string): Promise<boolean> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new UserError.NotFound('email', email);
		}

		// ? delete invalid email recovery tokens if exist
		await this.tokenRepository.delete({
			userId: user.id,
			purpose: TokenPurposeEnum.recoveryEmail,
		});

		const token = await this.tokenManager.sign({
			email: user.email,
			id: user.id,
			purpose: TokenPurposeEnum.recoveryEmail,
		});

		const tokenEntity = TokenEntity.create({
			userId: user.id,
			token: token.value,
			expiredAt: token.expired,
			purpose: token.purpose,
		}).toObject();

		try {
			await this.tokenRepository.create(tokenEntity);

			await this.emailSender.send({
				to: user.email,
				subject: 'Request for recovery of the Notō account',
				htmlContent: await this.emailTemplate.accountRecovery(user, tokenEntity),
			});
		} catch (error) {
			await this.tokenRepository.delete({ token: tokenEntity.token });
			throw error;
		}

		return true;
	}
}
