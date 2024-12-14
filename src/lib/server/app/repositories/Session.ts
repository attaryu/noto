import type { ICreateSessionDTO } from '$lib/server/domain/dtos/Session/CreateSession';
import type { ISessionDTO } from '$lib/server/domain/dtos/Session/Session';

export interface ISessionRepository {
	create(data: ICreateSessionDTO): Promise<ISessionDTO | null>;
	getSessionById(id: string): Promise<ISessionDTO | null>;
	getSessionByToken(token: string): Promise<ISessionDTO | null>;
}
