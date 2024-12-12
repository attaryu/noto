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
	recovery: {
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
	private readonly _recovery: UserInterface['recovery'] | undefined;

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

	get recoveryKey(): UserInterface['recovery'] | undefined {
		return this._recovery;
	}

	constructor(props: IUserOutDTO) {
		const { email, fullname, password, recovery, secretKey } = props;

		this._email = email;
		this._fullname = fullname;

		if (password) {
			this._password = password;
		}

		if (secretKey) {
			this._secretKey = secretKey;
		}

		if (recovery) {
			this._recovery = recovery;
		}
	}
}
