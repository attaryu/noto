export class TokenNotIncludedError extends Error {
	constructor() {
		super('Not finding token on your request.');
		this.name = 'TokenNotIncludedError';
	}
}
