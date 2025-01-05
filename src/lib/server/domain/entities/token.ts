import { TokenPurposeEnum } from '../enums/TokenPurpose';
import { TokenError } from '../errors/Token';

export interface TokenInterface {
	token: string;
	userId: string;
	purpose: TokenPurposeEnum;
	expiredAt: Date;
	createdAt?: Date;
}

export class TokenEntity {
	private readonly _token: TokenInterface['token'];
	private readonly _userId: TokenInterface['userId'];
	private readonly _purpose: TokenInterface['purpose'];
	private readonly _expiredAt: TokenInterface['expiredAt'];
	private readonly _createdAt: TokenInterface['createdAt'];

	static create(prop: TokenInterface): TokenEntity {
		if (!prop.token || typeof prop.token !== 'string') {
			throw new TokenError.Entity('token');
		}

		if (!prop.userId || typeof prop.userId !== 'string') {
			throw new TokenError.Entity('userId');
		}

		if (!prop.expiredAt || !(prop.expiredAt instanceof Date)) {
			throw new TokenError.Entity('expiredAt');
		}

		return new TokenEntity(prop);
	}

	get token(): TokenInterface['token'] {
		return this._token;
	}

	get userId(): TokenInterface['userId'] {
		return this._userId;
	}

	get purpose(): TokenInterface['purpose'] {
		return this._purpose;
	}

	get expiredAt(): TokenInterface['expiredAt'] {
		return this._expiredAt;
	}

	get createdAt(): TokenInterface['createdAt'] {
		return this._createdAt;
	}

	/**
	 * Copy all class property and value into objects, eliminate underscore annotations for private property
	 */
	public toObject(): TokenInterface {
		return {
			token: this._token,
			userId: this._userId,
			purpose: this._purpose,
			expiredAt: this._expiredAt,
			createdAt: this._createdAt,
		};
	}

	constructor(prop: TokenInterface) {
		this._token = prop.token;
		this._userId = prop.userId;
		this._purpose = prop.purpose;
		this._expiredAt = prop.expiredAt;
		this._createdAt = prop.createdAt ?? new Date();
	}
}
