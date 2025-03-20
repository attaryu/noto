import type { ITokenOutDTO } from '$lib/server/domain/dtos/Token/TokenOut';
import type { IUserInDTO } from '$lib/server/domain/dtos/User/UserIn';

export type TemplateList = 'AccountRecovery';

export interface IEmailTemplate {
	accountRecovery(user: IUserInDTO, token: ITokenOutDTO): Promise<string>;
}
