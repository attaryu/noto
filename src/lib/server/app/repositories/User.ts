import type { ICreateUserDTO } from '$lib/server/domain/dtos/User/CreateUser';
import type { IUserInDTO } from '$lib/server/domain/dtos/User/UserIn';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';

export interface IUserRepository {
	create(data: ICreateUserDTO): Promise<IUserOutDTO | null>;
	findById(id: string): Promise<IUserInDTO | null>;
	findByEmail(email: string): Promise<IUserInDTO | null>;
}
