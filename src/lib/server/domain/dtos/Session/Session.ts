/**
 * Session input from the recognized external source
 */
export interface ISessionDTO {
	token: string;
	userId: string;
	expiredAt: Date;
	createdAt?: Date;
}
