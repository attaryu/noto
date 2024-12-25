import type { UserInterface } from '../../entities/user';

export class UserEntityError extends Error {
	constructor(property: keyof UserInterface) {
		super(`Property ${property} is not suitable`);
	}
}
