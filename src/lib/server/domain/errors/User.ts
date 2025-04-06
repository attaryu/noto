
export namespace UserError {
	export class PasswordIncorrect extends Error {
		constructor() {
			super('The password is incorrect');
		}
	}

	export class RecoveryKeyIncorrect extends Error {
		constructor() {
			super(`Recovery key incorrect`);
			this.name = 'RecoveryKeyIncorrectError';
		}
	}

	export class AlreadyExist extends Error {
		constructor() {
			super(`Email already exists`);
			this.name = 'UserAlreadyExistError';
		}
	}

	export class NotFound extends Error {
		constructor() {
			super('User not found');
			this.name = 'UserNotFoundError';
		}
	}
}
