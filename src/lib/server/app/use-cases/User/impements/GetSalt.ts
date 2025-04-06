import type { IUserRepository } from '$lib/server/app/repositories/User';
import type { IGetSalt } from '../GetSalt';

import { UserError } from '$lib/server/domain/errors/User';

export class GetSalt implements IGetSalt {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(email: string): Promise<string> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new UserError.NotFound();
		}

		return user.password.salt;
	}
}
