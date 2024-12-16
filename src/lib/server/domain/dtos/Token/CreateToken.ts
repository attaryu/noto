/**
 * create token shape
 */
export interface ICreateTokenDTO {
	email: string;

	/**
	 * hashed password from user input
	 */
	password: string;
}
