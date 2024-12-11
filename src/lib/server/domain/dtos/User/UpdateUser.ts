export interface IUpdateUserDTO {
	fullname?: string;
	email?: string;

	/**
	 * Hashed password
	 */
	password?: {
		key: string;
		value: string;
	};

	/**
	 * Encrypted secret key by plain password
	 */
	secretKey?: string;

	/**
	 * Encrypted secret key by recovery keys
	 */
	recovery?: {
		[key: string]: string;
	};
}
