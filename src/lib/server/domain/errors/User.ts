import type { UserInterface } from '../entities/user';

export namespace UserError {
	export class PasswordIncorrect extends Error {
		constructor() {
			super('The password is incorrect');
		}
	}

	export class RecoveryKeyNotFound extends Error {
		constructor() {
			super(`recovery key with order not found`);
			this.name = 'RecoveryKeyNotFoundError';
		}
	}

	export class AlreadyExist extends Error {
		constructor() {
			super(`Email already exists`);
			this.name = 'UserAlreadyExistError';
		}
	}

	export class Entity extends Error {
		constructor(property: keyof UserInterface) {
			super(`Property ${property} is not suitable`);
		}
	}

	export class NotFound extends Error {
		constructor() {
			super('User not found');
			this.name = 'UserNotFoundError';
		}
	}
}
