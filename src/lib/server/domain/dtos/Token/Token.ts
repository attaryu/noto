import type { TokenPurposeEnum } from '../../enums/TokenPurpose';

/**
 * token input from the recognized external source
 */
export interface ITokenDTO {
	token: string;
	userId: string;
	purpose: TokenPurposeEnum;
	expiredAt: Date;
	createdAt?: Date;
}
