export interface IUpdateUserSecurityDTO {
	/**
	 * User password
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
		code: string;
		value: string;
		salt: string;
		iv: string;
	}[];
}
