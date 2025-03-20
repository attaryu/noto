import type { ITokenPayloadDTO } from '$lib/server/domain/dtos/Token/TokenPayload';
import type { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';

export interface ITokenManager {
	sign(
		payload: ITokenPayloadDTO,
	): Promise<{ value: string; expired: Date; purpose: TokenPurposeEnum }>;
	verify(token: string): Promise<ITokenPayloadDTO>;
}
