export class TokenPurposeError extends Error {
	constructor() {
		super(`The purpose of the token is invalid in the this endpoint`);
		this.name = 'TokenPurposeError';
	}
}
