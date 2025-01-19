export interface IUpdateUserDTO {
	fullname?: string;
	email?: string;

	/**
	 * Hashed password
	 */
	password?: {
		salt: string;
		value: string;
	};

	/**
	 * Encrypted secret key by plain password
	 */
	secretKey?: {
		value: string;
		iv: string;
	};

	/**
	 * Encrypted secret key by recovery keys
	 */
	recoveryKeys?: {
		/**
		 * first 4 digits on recovery keys for easy
		 */
		code: string;
		value: string;
		salt: string;
		iv: string;
	}[];
}
