export class UserNotFoundError extends Error {
	constructor(type?: 'email' | 'id', value?: string) {
		if (type && value) {
			super(`User with ${type} ${value} is not found`);
		} else {
			super('User not found');
		}
		
		this.name = 'UserNotFoundError';
	}
}
