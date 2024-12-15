import type { ICreateUserDTO } from '$lib/server/domain/dtos/User/CreateUser';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';

export interface ICreateUser {
	execute(data: ICreateUserDTO): Promise<IUserOutDTO>;
}
