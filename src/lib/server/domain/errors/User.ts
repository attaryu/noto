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
		constructor(type?: 'email' | 'id', value?: string) {
			if (type && value) {
				super(`User with ${type} ${value} is not found`);
			} else {
				super('User not found');
			}

			this.name = 'UserNotFoundError';
		}
	}
}
