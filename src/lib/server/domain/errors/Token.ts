export namespace TokenError {
	export class Invalid extends Error {
		constructor() {
			super('Invalid token, request cannot be processed!');
			this.name = 'TokenInvalidError';
		}
	}

	export class NotIncluded extends Error {
		constructor() {
			super('Not finding token on the request.');
			this.name = 'TokenNotIncludedError';
		}
	}

	export class NotRegistered extends Error {
		constructor() {
			super('Token is not registered on the server');
			this.name = 'TokenNotRegisteredError';
		}
	}

	export class Purpose extends Error {
		constructor() {
			super(`The purpose of the token is invalid.`);
			this.name = 'TokenPurposeError';
		}
	}
}
