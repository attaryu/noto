import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';

export interface IGetUser {
	execute(id: string): Promise<IUserOutDTO>;
}
