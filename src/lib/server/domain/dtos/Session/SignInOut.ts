/**
 * Sign in output
 */
export interface ISignInOutDTO {
	token: string;
	userId: string;
	expiredAt: Date;
	createdAt?: Date;
	user: {
		id: string;
		fullname: string;
		email: string;
	};
}
