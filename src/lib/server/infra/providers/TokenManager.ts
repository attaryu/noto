import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenPayloadDTO } from '$lib/server/domain/dtos/Token/CreateTokenPayload';

import { SignJWT, jwtVerify } from 'jose';

import { SECRET_KEY } from '$env/static/private';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenError } from '$lib/server/domain/errors/Token';

export class TokenManager implements ITokenManager {
	async sign(
		payload: ITokenPayloadDTO,
	): Promise<{ value: string; expired: Date; purpose: TokenPurposeEnum }> {
		let expiredTime = Date.now();

		switch (payload.purpose) {
			case TokenPurposeEnum.resetPassword:
			case TokenPurposeEnum.recoveryEmail:
				expiredTime += 1000 * 60 * 60;
				break;
			default:
				expiredTime += 1000 * 60 * 60 * 24;
		}

		const jwt = await new SignJWT({ ...payload })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime(expiredTime)
			.sign(this.getKey());

		return {
			value: jwt,
			expired: new Date(expiredTime),
			purpose: payload.purpose,
		};
	}

	async verify(token: string): Promise<ITokenPayloadDTO> {
		try {
			const { payload } = await jwtVerify<ITokenPayloadDTO>(token, this.getKey());
			return payload;
		} catch {
			throw new TokenError.Invalid();
		}
	}

	private getKey() {
		return new TextEncoder().encode(SECRET_KEY);
	}
}
