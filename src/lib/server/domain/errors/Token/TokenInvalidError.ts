export class TokenInvalidError extends Error {
	constructor() {
		super('Invalid token, request cannot be processed!');
		this.name = 'TokenInvalidError';
	}
}
