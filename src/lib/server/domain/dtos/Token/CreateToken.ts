/**
 * create token shape from user input
 */
export interface ICreateTokenDTO {
	email: string;

	/**
	 * hashed password from user input
	 */
	password: string;
}
