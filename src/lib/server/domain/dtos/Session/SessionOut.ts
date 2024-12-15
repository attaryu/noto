/**
 * create session output to external 
 */
export interface ISessionOutDTO {
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
