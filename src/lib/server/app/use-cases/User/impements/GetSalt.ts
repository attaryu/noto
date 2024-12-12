import type { IUserRepository } from '$lib/server/app/repositories/User';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';
import type { IGetSalt } from '../GetSalt';

export class GetSalt implements IGetSalt {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(email: string): Promise<string> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new UserNotFoundError('email', email);
		}

		return user.password.salt;
	}
}
