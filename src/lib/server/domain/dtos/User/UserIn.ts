/**
 * DTO to receive data from external sources
 */
export interface IUserInDTO {
	id: string;
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
