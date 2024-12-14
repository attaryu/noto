import type { SessionInterface } from '../../entities/session';

export class SessionEntityError extends Error {
	constructor(property: keyof SessionInterface) {
		super(`Property ${property} is not suitable`);
	}
}
