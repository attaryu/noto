import type { IUpdateUserBasicDTO } from '$lib/server/domain/dtos/User/UpdateUserBasic';
import type { IUserOutDTO } from '$lib/server/domain/dtos/User/UserOut';

export interface IUpdateBasicInfo {
	execute(id: string, payload: IUpdateUserBasicDTO): Promise<IUserOutDTO>;
}
