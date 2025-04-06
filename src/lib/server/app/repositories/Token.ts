import type { ITokenInDTO } from '$lib/server/domain/dtos/Token/TokenIn';
export interface ITokenRepository {
	create(data: ITokenInDTO): Promise<ITokenInDTO | null>;
	getSessionById(id: string): Promise<ITokenInDTO | null>;
	getSessionByToken(token: string): Promise<ITokenInDTO | null>;
	delete(query: Partial<ITokenInDTO>): Promise<void>;
}
