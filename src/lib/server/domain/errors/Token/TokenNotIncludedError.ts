export class TokenNotIncludedError extends Error {
	constructor() {
		super('Not finding token on the request.');
		this.name = 'TokenNotIncludedError';
	}
}
