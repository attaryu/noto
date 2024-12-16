import type { UserInterface } from '../../entities/user';

/**
 * create token output to external
 */
export interface ITokenOutDTO {
	token: string;
	userId: string;
	purpose: 'session' | 'reset-password';
	expiredAt: Date;
	createdAt?: Date;
	user?: UserInterface
}
