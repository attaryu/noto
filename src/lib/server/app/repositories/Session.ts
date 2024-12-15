import type { ISessionDTO } from '$lib/server/domain/dtos/Session/Session';

export interface ISessionRepository {
	create(data: ISessionDTO): Promise<ISessionDTO | null>;
	getSessionById(id: string): Promise<ISessionDTO | null>;
	getSessionByToken(token: string): Promise<ISessionDTO | null>;
	delete(token: string): Promise<void>;
}
