import type { IPasswordHasher } from '$lib/server/app/providers/PasswordHasher';
import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ISessionRepository } from '$lib/server/app/repositories/Session';
import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { ISignInOutDTO } from '$lib/server/domain/dtos/Session/SignInOut';
import type { ISignInDTO } from '$lib/server/domain/dtos/User/SignInUser';
import type { ISignIn } from '../SignIn';

import { SessionEntity } from '$lib/server/domain/entities/session';
import { PasswordIncorrectError } from '$lib/server/domain/errors/User/PasswordIncorrectError';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';

export class SignIn implements ISignIn {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly sessionRepository: ISessionRepository,
		private readonly tokenManager: ITokenManager,
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(data: ISignInDTO): Promise<ISignInOutDTO> {
		const user = await this.userRepository.findByEmail(data.email);

		if (!user) {
			throw new UserNotFoundError('email', data.email);
		}

		const isPasswordCorrect = await this.passwordHasher.compare(data.password, user.password.value);

		if (!isPasswordCorrect) {
			throw new PasswordIncorrectError();
		}

		const token = await this.tokenManager.sign({ id: user.id, email: user.email });

		const sessionEntity = SessionEntity.create({
			userId: user.id,
			token: token.value,
			expiredAt: token.expired,
		});

		await this.sessionRepository.create({
			token: sessionEntity.token,
			userId: sessionEntity.userId,
			expiredAt: sessionEntity.expiredAt,
			createdAt: sessionEntity.createdAt!,
		});

		return {
			token: sessionEntity.token,
			userId: sessionEntity.userId,
			expiredAt: sessionEntity.expiredAt,
			user,
		};
	}
}
