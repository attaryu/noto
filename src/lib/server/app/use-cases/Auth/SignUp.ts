import type { ICreateUserDTO } from '$lib/server/domain/dtos/User/CreateUser';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';

export interface ISignUp {
	execute(data: ICreateUserDTO): Promise<IUserOutDTO>;
}
