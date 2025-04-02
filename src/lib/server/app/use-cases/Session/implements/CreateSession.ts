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
import { UserEntity } from '$lib/server/domain/entities/user';

export class CreateSession implements ICreateSession {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly tokenRepository: ITokenRepository,
		private readonly tokenManager: ITokenManager,
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(data: ICreateTokenDTO): Promise<ITokenOutDTO> {
		const existingUser = await this.userRepository.findByEmail(data.email);

		if (!existingUser) {
			throw new UserError.NotFound();
		}

		const user = new UserEntity(existingUser).toObject();

		const isPasswordCorrect = await this.passwordHasher.compare(data.password, user.password.value);

		if (!isPasswordCorrect) {
			throw new UserError.PasswordIncorrect();
		}

		const rawToken = await this.tokenManager.sign({
			purpose: TokenPurposeEnum.session,
			userId: user.id!,
		});

		const token = TokenEntity.create({
			userId: user.id!,
			expiredAt: rawToken.expired,
			token: rawToken.value,
			purpose: rawToken.purpose,
		}).toObject();

		await this.tokenRepository.create(token);

		return {
			...token,
			user,
			id: token.id!,
		};
	}
}
