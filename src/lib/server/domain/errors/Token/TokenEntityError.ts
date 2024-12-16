import type { TokenInterface } from '../../entities/token';

export class TokenEntityError extends Error {
	constructor(property: keyof TokenInterface) {
		super(`Property ${property} is not suitable`);
	}
}
