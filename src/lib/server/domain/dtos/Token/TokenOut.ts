import type { UserInterface } from '../../entities/user';
import type { TokenPurposeEnum } from '../../enums/TokenPurpose';

/**
 * create token output to external
 */
export interface ITokenOutDTO {
	token: string;
	userId: string;
	purpose: TokenPurposeEnum;
	expiredAt: Date;
	createdAt?: Date;
	user?: UserInterface;
}
