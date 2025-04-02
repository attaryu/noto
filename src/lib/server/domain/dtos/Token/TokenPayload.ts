import type { TokenPurposeEnum } from '../../enums/TokenPurpose';

/**
 * processed token input
 */
export interface ITokenPayloadDTO {
	purpose: TokenPurposeEnum;
	userId: string;
}
