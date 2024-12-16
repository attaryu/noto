/**
 * Payload for token
 */
export interface ITokenPayloadDTO {
	id: string;
	email: string;
	purpose: 'session' | 'reset-password';
}
