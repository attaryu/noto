import { getContext, setContext } from 'svelte';

export interface IUserStore {
	id: string;
	fullname: string;
	email: string;
}

export type IUpdateUserStore = Partial<Omit<IUserStore, 'id'>>;

class UserStore {
	private _id: string = $state('');
	private _fullname: string = $state('');
	private _email: string = $state('');
	
	constructor(id: string, fullname: string, email: string) {
		this._id = id;
		this._fullname = fullname;
		this._email = email;
	}

	get id() {
		return this._id;
	}

	get fullname() {
		return this._fullname;
	}

	get email() {
		return this._email;
	}

	update(data: IUpdateUserStore) {
		this._fullname = data.fullname || this._fullname;
		this._email = data.email || this._email;
	}
}

const key = Symbol('user');

export function setUserStore(data: IUserStore) {
	return setContext(key, new UserStore(data.id, data.fullname, data.email));
}

export function getUserStore() {
	return getContext<UserStore>(key);
}
