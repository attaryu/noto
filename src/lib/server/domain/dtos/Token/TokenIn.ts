import type { TokenPurposeEnum } from '../../enums/TokenPurpose';

/**
 * Payload for token
 */
export interface ITokenInDTO {
	userId: string;
	token: string;
	expiredAt: string;
	purpose: TokenPurposeEnum;
}
