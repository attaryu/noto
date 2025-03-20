import type { ITokenInDTO } from '../dtos/Token/TokenIn';
import type { TokenPurposeEnum } from '../enums/TokenPurpose';

import { Validation } from '../helper/validation';

export interface TokenInterface {
	id?: string;
	token: string;
	userId: string;
	purpose: TokenPurposeEnum;
	expiredAt: Date;
}

export class TokenEntity {
	private _id: TokenInterface['id'];
	private _token: TokenInterface['token'];
	private _userId: TokenInterface['userId'];
	private _purpose: TokenInterface['purpose'];
	private _expiredAt: TokenInterface['expiredAt'];

	static create(props: ITokenInDTO): TokenEntity {
		Validation.object(props, {
			type: 'object',
			required: true,
			properties: {
				token: { type: 'string', required: true },
				userId: { type: 'string', required: true },
				purpose: { type: 'number', required: true },
				expiredAt: { type: 'any', required: true },
			},
		});

		return new TokenEntity(props);
	}

	public toObject(): TokenInterface {
		return {
			id: this._id,
			token: this._token,
			userId: this._userId,
			purpose: this._purpose,
			expiredAt: this._expiredAt,
		};
	}

	get token() {
		return this._token;
	}

	get userId() {
		return this._userId;
	}

	get purpose() {
		return this._purpose;
	}

	get expiredAt() {
		return this._expiredAt;
	}

	constructor(prop: TokenInterface) {
		this._id = prop.id;
		this._token = prop.token;
		this._userId = prop.userId;
		this._purpose = prop.purpose;
		this._expiredAt = prop.expiredAt;
	}
}
