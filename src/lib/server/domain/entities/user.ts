import type { ICreateUserDTO } from '../dtos/User/CreateUser';
import type { IUpdateUserDTO } from '../dtos/User/UpdateUser';
import type { IUserOutDTO } from '../dtos/User/UserOut';
import { UserEntityError } from '../errors/User/UserEntityError';

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
	secretKey: string;

	/**
	 * Encrypted secret key by recovery keys
	 */
	recoveryKeys: {
		[key: string]: string;
	};

	createdAt: Date;
	updateAt: Date;
}

export class UserEntity {
	private readonly _fullname: string | undefined;
	private readonly _email: string | undefined;
	private readonly _password: UserInterface['password'] | undefined;
	private readonly _secretKey: string | undefined;
	private readonly _recoveryKeys: UserInterface['recoveryKeys'] | undefined;

	static create(props: ICreateUserDTO): UserEntity {
		return new UserEntity(props);
	}

	// ? use static updates method for a while
	static update(props: IUpdateUserDTO): IUpdateUserDTO {
		const { email, fullname, password, recoveryKeys, secretKey } = props;

		if (email === undefined || !email || typeof email !== 'string') {
			throw new UserEntityError('email');
		}

		if (fullname === undefined || !fullname || typeof fullname !== 'string') {
			throw new UserEntityError('fullname');
		}

		if (secretKey === undefined || !secretKey || typeof secretKey !== 'string') {
			throw new UserEntityError('secretKey');
		}

		if (password !== undefined) {
			const { salt, value } = password;

			if (
				!salt ||
				!value ||
				typeof password !== 'object' ||
				typeof salt !== 'string' ||
				typeof value !== 'string'
			) {
				throw new UserEntityError('password');
			}
		}

		if (recoveryKeys !== undefined) {
			if (typeof recoveryKeys !== 'object') {
				throw new UserEntityError('recoveryKeys');
			}

			for (const key in recoveryKeys) {
				if (!recoveryKeys[key] || typeof recoveryKeys[key] !== 'string') {
					throw new UserEntityError('recoveryKeys');
				}
			}
		}

		return props;
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

	get secretKey(): string | undefined {
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
