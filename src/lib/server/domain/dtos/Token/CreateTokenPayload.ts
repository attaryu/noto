import type { TokenPurposeEnum } from '../../enums/TokenPurpose';

/**
 * Payload for token
 */
export interface ITokenPayloadDTO {
	id: string;
	email: string;
	fullname: string;
	purpose: TokenPurposeEnum;
}
