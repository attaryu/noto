export class UserAlreadyExistError extends Error {
	constructor(email: string) {
		super(`Email ${email} already exists`);
		this.name = 'UserAlreadyExistError';
	}
}
