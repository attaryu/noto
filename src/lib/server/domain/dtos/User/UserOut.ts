/**
 * DTO for data sent to external sources
 */
export interface IUserOutDTO {
	id?: string;
	fullname: string;
	email: string;

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
	secretKey?: string;

	/**
	 * Encrypted secret key by recovery keys
	 */
	recovery?: {
		[key: string]: string;
	};

	createdAt?: Date;
	updateAt?: Date;
}
