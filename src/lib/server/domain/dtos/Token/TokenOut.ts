import type { UserInterface } from '../../entities/user';
import type { TokenPurposeEnum } from '../../enums/TokenPurpose';

/**
 * create token output to external
 */
export interface ITokenOutDTO {
	id: string;
	token: string;
	purpose: TokenPurposeEnum;
	expiredAt: string;
	user?: UserInterface;
}
