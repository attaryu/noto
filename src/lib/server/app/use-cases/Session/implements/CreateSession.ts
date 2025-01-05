import type { IPasswordHasher } from '$lib/server/app/providers/PasswordHasher';
import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { ICreateTokenDTO } from '$lib/server/domain/dtos/Token/CreateToken';
import type { ITokenOutDTO } from '$lib/server/domain/dtos/Token/TokenOut';
import type { ICreateSession } from '../CreateSession';

import { TokenEntity } from '$lib/server/domain/entities/token';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { UserError } from '$lib/server/domain/errors/User';

export class CreateSession implements ICreateSession {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly tokenRepository: ITokenRepository,
		private readonly tokenManager: ITokenManager,
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(data: ICreateTokenDTO): Promise<ITokenOutDTO> {
		const user = await this.userRepository.findByEmail(data.email);

		if (!user) {
			throw new UserError.NotFound('email', data.email);
		}

		const isPasswordCorrect = await this.passwordHasher.compare(data.password, user.password.value);

		if (!isPasswordCorrect) {
			throw new UserError.PasswordIncorrect();
		}

		const token = await this.tokenManager.sign({
			id: user.id,
			email: user.email,
			purpose: TokenPurposeEnum.session,
		});

		const session = TokenEntity.create({
			userId: user.id,
			expiredAt: token.expired,
			token: token.value,
			purpose: token.purpose,
		}).toObject();

		await this.tokenRepository.create(session);

		return {
			...session,
			user,
		};
	}
}
