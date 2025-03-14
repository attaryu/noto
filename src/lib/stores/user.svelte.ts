import { getContext, hasContext, setContext } from 'svelte';

export interface IUserStore {
	id: string;
	fullname: string;
	email: string;
	image: string;
	secretKey: {
		iv: string;
		key: CryptoKey;
	}
}

export type IUpdateUserStore = Partial<Omit<IUserStore, 'id'>>;

class UserStore {
	constructor(
		private _id: string,
		private _fullname: string,
		private _email: string,
		private _image: string,
	) {}

	get id() {
		return this._id;
	}

	get fullname() {
		return this._fullname;
	}

	get email() {
		return this._email;
	}

	get image() {
		return this._image;
	}
}

const key = Symbol('user');

export function setUserStore(data: IUserStore) {
	return setContext(key, new UserStore(data.id, data.fullname, data.email, data.image));
}

export function getUserStore() {
	return getContext<UserStore>(key);
}
