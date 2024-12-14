/**
 * Sign in input for creating user session
 */
export interface ISignInDTO {
	email: string;

	/**
	 * hashed password from user input
	 */
	password: string;
}
