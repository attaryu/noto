import { SessionEntityError } from '../errors/Session/SessionEntityError';

export interface SessionInterface {
	token: string;
	userId: string;
	expiredAt: Date;
	createdAt?: Date;
}

export class SessionEntity {
	private readonly _token: SessionInterface['token'];
	private readonly _userId: SessionInterface['userId'];
	private readonly _expiredAt: SessionInterface['expiredAt'];
	private readonly _createdAt: SessionInterface['createdAt'];

	static create(prop: SessionInterface): SessionEntity {
		if (!prop.token || typeof prop.token !== 'string') {
			throw new SessionEntityError('token');
		}

		if (!prop.userId || typeof prop.userId !== 'string') {
			throw new SessionEntityError('userId');
		}

		if (!prop.expiredAt || !(prop.expiredAt instanceof Date)) {
			throw new SessionEntityError('expiredAt');
		}

		return new SessionEntity(prop);
	}

	get token(): SessionInterface['token'] {
		return this._token;
	}

	get userId(): SessionInterface['userId'] {
		return this._userId;
	}

	get expiredAt(): SessionInterface['expiredAt'] {
		return this._expiredAt;
	}

	get createdAt(): SessionInterface['createdAt'] {
		return this._createdAt;
	}

	constructor(prop: SessionInterface) {
		this._token = prop.token;
		this._userId = prop.userId;
		this._expiredAt = prop.expiredAt;
		this._createdAt = prop.createdAt ?? new Date();
	}
}
