import type { ICreateTokenDTO } from '$lib/server/domain/dtos/Token/CreateToken';
import type { ITokenOutDTO } from '$lib/server/domain/dtos/Token/TokenOut';

export interface ICreateSession {
	execute(data: ICreateTokenDTO): Promise<ITokenOutDTO>;
}
