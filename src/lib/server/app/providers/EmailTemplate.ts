import type { ITokenDTO } from '$lib/server/domain/dtos/Token/Token';
import type { IUserInDTO } from '$lib/server/domain/dtos/User/UserIn';

export type TemplateList = 'AccountRecovery';

export interface IEmailTemplate {
	accountRecovery(user: IUserInDTO, token: ITokenDTO): Promise<string>;
}
