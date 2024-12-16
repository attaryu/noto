import type { ITokenDTO } from '$lib/server/domain/dtos/Token/Token';

export interface ITokenRepository {
	create(data: ITokenDTO): Promise<ITokenDTO | null>;
	getSessionById(id: string): Promise<ITokenDTO | null>;
	getSessionByToken(token: string): Promise<ITokenDTO | null>;
	delete(token: string): Promise<void>;
}
