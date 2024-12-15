import type { ICreateSessionDTO } from '$lib/server/domain/dtos/Session/CreateSession';
import type { ISessionOutDTO } from '$lib/server/domain/dtos/Session/SessionOut';

export interface ICreateSession {
	execute(data: ICreateSessionDTO): Promise<ISessionOutDTO>;
}
