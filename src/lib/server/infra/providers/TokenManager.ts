import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ICreateTokenPayloadDTO } from '$lib/server/domain/dtos/Session/CreateTokenPayload';

import { SECRET_KEY } from '$env/static/private';
import { SignJWT, jwtDecrypt } from 'jose';

export class TokenManager implements ITokenManager {
	async sign(payload: ICreateTokenPayloadDTO): Promise<{ value: string; expired: Date }> {
		const expiredTime = new Date(Date.now() + 1000 * 60 * 60 * 24);
		const jwt = await new SignJWT({ ...payload })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime(expiredTime)
			.sign(this.getKey());

		return {
			value: jwt,
			expired: expiredTime,
		};
	}

	async verify(token: string): Promise<boolean> {
		try {
			await this.decrypt(token);
		} catch (e) {
			return false;
		}

		return true;
	}

	async decrypt(token: string): Promise<ICreateTokenPayloadDTO> {
		const { payload } = await jwtDecrypt<ICreateTokenPayloadDTO>(token, this.getKey());
		return payload;
	}

	private getKey() {
		return new TextEncoder().encode(SECRET_KEY);
	}
}
