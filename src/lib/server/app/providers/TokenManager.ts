import type { ICreateTokenPayloadDTO } from '$lib/server/domain/dtos/Session/CreateTokenPayload';

export interface ITokenManager {
	sign(payload: ICreateTokenPayloadDTO): Promise<{ value: string; expired: Date }>;
	verify(token: string): Promise<boolean>;
	decrypt(token: string): Promise<ICreateTokenPayloadDTO>;
}
