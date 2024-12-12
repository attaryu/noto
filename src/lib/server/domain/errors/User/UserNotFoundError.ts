export class UserNotFoundError extends Error {
	constructor(type: 'email' | 'id', value: string) {
		super(`User with ${type} ${value} is not found`);
		this.name = 'UserNotFoundError';
	}
}
