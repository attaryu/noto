export class TokenPurposeError extends Error {
	constructor() {
		super(`The purpose of the token is invalid.`);
		this.name = 'TokenPurposeError';
	}
}
