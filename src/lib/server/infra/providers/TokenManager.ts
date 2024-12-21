import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ITokenPayloadDTO } from '$lib/server/domain/dtos/Token/CreateTokenPayload';

import { SECRET_KEY } from '$env/static/private';
import { SignJWT, jwtDecrypt } from 'jose';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';

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

	async verify(token: string): Promise<boolean> {
		try {
			await this.decrypt(token);
		} catch (e) {
			return false;
		}

		return true;
	}

	async decrypt(token: string): Promise<ITokenPayloadDTO> {
		const { payload } = await jwtDecrypt<ITokenPayloadDTO>(token, this.getKey());
		return payload;
	}

	private getKey() {
		return new TextEncoder().encode(SECRET_KEY);
	}
}
