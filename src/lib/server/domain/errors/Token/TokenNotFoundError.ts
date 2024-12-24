export class TokenNotFoundError extends Error {
	constructor() {
		super('Token was not found');
		this.name = 'TokenNotFoundError';
	}
}
