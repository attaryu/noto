import { SessionEntityError } from '../errors/Session/SessionEntityError';

export interface SessionInterface {
	token: string;
	userId: string;
	expiredAt: Date;
	createAt?: Date;
}

export class SessionEntity {
	private _token: SessionInterface['token'];
	private _userId: SessionInterface['userId'];
	private _expiredAt: SessionInterface['expiredAt'];
	private _createAt: SessionInterface['createAt'];

	public static create(prop: SessionInterface) {
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

	get createAt(): SessionInterface['createAt'] {
		return this._createAt;
	}

	constructor(prop: SessionInterface) {
		this._token = prop.token;
		this._userId = prop.userId;
		this._expiredAt = prop.expiredAt;
		this._createAt = prop.createAt ?? new Date();
	}
}
