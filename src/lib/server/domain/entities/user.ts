import type { ICreateUserDTO } from '../dtos/User/CreateUser';
import type { IUpdateUserDTO } from '../dtos/User/UpdateUser';
import type { IUserOutDTO } from '../dtos/User/UserOut';

import { UserError } from '../errors/User';

export interface UserInterface {
	id?: string;
	fullname: string;
	email: string;

	/**
	 * Hashed password
	 */
	password: {
		salt: string;
		value: string;
	};

	/**
	 * Encrypted secret key by plain password
	 */
	secretKey: {
		value: string;
		iv: string;
	};

	/**
	 * Encrypted secret key by recovery keys
	 */
	recoveryKeys: {
		/**
		 * first 4 digits on recovery keys for easy
		 */
		code: string;
		value: string;
		salt: string;
		iv: string;
	}[];

	createdAt: Date;
	updateAt: Date;
}

export class UserEntity {
	private readonly _fullname: string | undefined;
	private readonly _email: string | undefined;
	private readonly _password: UserInterface['password'] | undefined;
	private readonly _secretKey: UserInterface['secretKey'] | undefined;
	private readonly _recoveryKeys: UserInterface['recoveryKeys'] | undefined;

	static create(props: ICreateUserDTO): UserEntity {
		return new UserEntity(props);
	}

	// ? use static updates method for a while
	static update(props: IUpdateUserDTO): IUpdateUserDTO {
		const { email, fullname, password, recoveryKeys, secretKey } = props;

		if (email !== undefined && (!email || typeof email !== 'string')) {
			throw new UserError.Entity('email');
		}

		if (fullname !== undefined && (!fullname || typeof fullname !== 'string')) {
			throw new UserError.Entity('fullname');
		}

		if (secretKey !== undefined && (!secretKey || typeof secretKey !== 'object')) {
			throw new UserError.Entity('secretKey');
		}

		if (password !== undefined) {
			UserEntity.validatePassword(password);
		}

		if (recoveryKeys !== undefined) {
			UserEntity.validateRecoveryKeys(recoveryKeys);
		}

		return props;
	}

	static validatePassword(password: UserInterface['password']): void {
		if (typeof password !== 'object') {
			throw new UserError.Entity('password');
		}

		const { salt, value } = password;

		if (salt !== undefined && (!salt || typeof salt !== 'string')) {
			throw new UserError.Entity('recoveryKeys');
		}

		if (value !== undefined && (!value || typeof value !== 'string')) {
			throw new UserError.Entity('recoveryKeys');
		}
	}

	static validateRecoveryKeys(recoveryKeys: UserInterface['recoveryKeys']): void {
		if (typeof recoveryKeys !== 'object') {
			throw new UserError.Entity('recoveryKeys');
		}

		for (const key in recoveryKeys) {
			if (!recoveryKeys[key] || typeof recoveryKeys[key] !== 'string') {
				throw new UserError.Entity('recoveryKeys');
			}
		}
	}

	get fullname(): string | undefined {
		return this._fullname;
	}

	get email(): string | undefined {
		return this._email;
	}

	get password(): UserInterface['password'] | undefined {
		return this._password;
	}

	get secretKey(): UserInterface['secretKey'] | undefined {
		return this._secretKey;
	}

	get recoveryKeys(): UserInterface['recoveryKeys'] | undefined {
		return this._recoveryKeys;
	}

	constructor(props: IUserOutDTO | IUpdateUserDTO) {
		const { email, fullname, password, recoveryKeys, secretKey } = props;

		if (email) {
			this._email = email;
		}

		if (fullname) {
			this._fullname = fullname;
		}

		if (password) {
			this._password = password;
		}

		if (secretKey) {
			this._secretKey = secretKey;
		}

		if (recoveryKeys) {
			this._recoveryKeys = recoveryKeys;
		}
	}
}
