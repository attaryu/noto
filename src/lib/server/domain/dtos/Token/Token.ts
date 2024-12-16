/**
 * token input from the recognized external source
 */
export interface ITokenDTO {
	token: string;
	userId: string;
	purpose: 'session' | 'reset-password';
	expiredAt: Date;
	createdAt?: Date;
}
