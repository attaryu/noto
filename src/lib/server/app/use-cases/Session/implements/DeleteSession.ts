import type { ISessionRepository } from '$lib/server/app/repositories/Session';
import type { IDeleteSession } from '../DeleteSesion';

export class DeleteSession implements IDeleteSession {
	constructor(private readonly sessionRepository: ISessionRepository) {}

	async execute(token: string): Promise<void> {
		await this.sessionRepository.delete(token);
	}
}
