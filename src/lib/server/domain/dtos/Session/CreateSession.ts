/**
 * create session or sign in shape
 */
export interface ICreateSessionDTO {
	email: string;

	/**
	 * hashed password from user input
	 */
	password: string;
}
