import type { IUpdateUserDTO } from '$lib/server/domain/dtos/User/UpdateUser';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';

export interface ISecurityReset {
  execute(token: string, security: IUpdateUserDTO): Promise<IUserOutDTO>;
}