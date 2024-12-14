/**
 * Interface for creating new session
 */
export interface ICreateSessionDTO {
	token: string;
	userId: string;
	expiredAt: Date;
	createdAt?: Date;
}
