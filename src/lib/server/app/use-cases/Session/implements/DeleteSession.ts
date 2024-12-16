import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IDeleteSession } from '../DeleteSesion';

export class DeleteSession implements IDeleteSession {
	constructor(private readonly sessionRepository: ITokenRepository) {}

	async execute(token: string): Promise<void> {
		await this.sessionRepository.delete(token);
	}
}
