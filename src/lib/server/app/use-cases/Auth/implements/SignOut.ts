import type { ISessionRepository } from '$lib/server/app/repositories/Session';
import type { ISignOut } from '../SignOut';

export class SignOut implements ISignOut {
	constructor(private readonly sessionRepository: ISessionRepository) {}

	async execute(token: string): Promise<void> {
		await this.sessionRepository.delete(token);
	}
}
