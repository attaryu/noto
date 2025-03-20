import type { TokenPurposeEnum } from '../../enums/TokenPurpose';
import type { IUserOutDTO } from '../User/UserOut';

/**
 * processed token input
 */
export interface ITokenPayloadDTO {
	purpose: TokenPurposeEnum;
	user: IUserOutDTO;
}
