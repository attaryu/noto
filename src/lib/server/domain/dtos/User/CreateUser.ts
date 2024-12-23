export interface ICreateUserDTO {
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
}
