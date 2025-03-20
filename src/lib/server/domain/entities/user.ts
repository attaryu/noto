import type { ICreateUserDTO } from '../dtos/User/CreateUser';
import type { IUpdateUserDTO } from '../dtos/User/UpdateUser';

import { Validation } from '../helper/validation';

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
}

export class UserEntity {
	private _id?: string;
	private _fullname: string;
	private _email: string;
	private _password: UserInterface['password'];
	private _secretKey: UserInterface['secretKey'];
	private _recoveryKeys: UserInterface['recoveryKeys'];

	static create(props: ICreateUserDTO): UserEntity {
		Validation.object(props, {
			type: 'object',
			required: true,
			properties: {
				fullname: { type: 'string', required: true },
				email: { type: 'string', required: true },
				password: {
					type: 'object',
					required: true,
					properties: {
						salt: { type: 'string', required: true },
						value: { type: 'string', required: true },
					},
				},
				secretKey: {
					type: 'object',
					required: true,
					properties: {
						value: { type: 'string', required: true },
						iv: { type: 'string', required: true },
					},
				},
				recoveryKeys: {
					type: 'array',
					required: true,
					items: {
						type: 'object',
						required: true,
						properties: {
							code: { type: 'string', required: true },
							iv: { type: 'string', required: true },
							salt: { type: 'string', required: true },
							value: { type: 'string', required: true },
						},
					},
				},
			},
		});

		return new UserEntity(props);
	}

	public update(props: IUpdateUserDTO): void {
		Validation.object(props, {
			type: 'object',
			required: true,
			properties: {
				fullname: { type: 'string' },
				email: { type: 'string' },
				password: {
					type: 'object',
					properties: {
						salt: { type: 'string', required: true },
						value: { type: 'string', required: true },
					},
				},
				secretKey: {
					type: 'object',
					properties: {
						value: { type: 'string', required: true },
						iv: { type: 'string', required: true },
					},
				},
				recoveryKeys: {
					type: 'array',
					items: {
						type: 'object',
						required: true,
						properties: {
							code: { type: 'string', required: true },
							iv: { type: 'string', required: true },
							salt: { type: 'string', required: true },
							value: { type: 'string', required: true },
						},
					},
				},
			},
		});

		const { email, fullname, password, recoveryKeys, secretKey } = props;

		if (email !== undefined) {
			this._email = email;
		}

		if (fullname !== undefined) {
			this._fullname = fullname;
		}

		if (secretKey !== undefined) {
			this._secretKey = secretKey;
		}

		if (password !== undefined) {
			this._password = password;
		}

		if (recoveryKeys !== undefined) {
			this._recoveryKeys = recoveryKeys;
		}
	}

	public toObject(): UserInterface {
		return {
			id: this._id,
			fullname: this._fullname,
			email: this._email,
			password: this._password,
			secretKey: this._secretKey,
			recoveryKeys: this._recoveryKeys,
		};
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

	get password() {
		return this._password;
	}

	get secretKey() {
		return this._secretKey;
	}

	get recoveryKeys() {
		return this._recoveryKeys;
	}

	constructor(props: UserInterface) {
		this._id = props.id;
		this._email = props.email;
		this._fullname = props.fullname;
		this._password = props.password;
		this._secretKey = props.secretKey;
		this._recoveryKeys = props.recoveryKeys;
	}
}
