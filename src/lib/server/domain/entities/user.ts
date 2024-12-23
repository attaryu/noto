import type { ICreateUserDTO } from '../dtos/User/CreateUser';
import type { IUserOutDTO } from '../dtos/User/UserOut';

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
	private readonly _fullname: string;
	private readonly _email: string;
	private readonly _password: UserInterface['password'] | undefined;
	private readonly _secretKey: string | undefined;
	private readonly _recoveryKeys: UserInterface['recoveryKeys'] | undefined;

	static create(props: ICreateUserDTO): UserEntity {
		return new UserEntity(props);
	}

	get fullname(): string {
		return this._fullname;
	}

	get email(): string {
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

	constructor(props: IUserOutDTO) {
		const { email, fullname, password, recoveryKeys, secretKey } = props;

		this._email = email;
		this._fullname = fullname;

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
