export class TokenInvalidError extends Error {
	constructor() {
		super('Token tidak valid!');
		this.name = 'TokenInvalidError';
	}
}
