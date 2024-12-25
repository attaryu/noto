export class TokenNotRegisteredError extends Error {
	constructor() {
		super('Token is not registered on the server');
		this.name = 'TokenNotRegisteredError';
	}
}
