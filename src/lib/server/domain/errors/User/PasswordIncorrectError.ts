export class PasswordIncorrectError extends Error {
	constructor() {
		super('The password is incorrect');
	}
}
