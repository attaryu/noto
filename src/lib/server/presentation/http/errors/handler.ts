import type { IResponseDTO } from '$lib/server/domain/dtos/Response';

import { PasswordIncorrectError } from '$lib/server/domain/errors/User/PasswordIncorrectError';
import { UserAlreadyExistError } from '$lib/server/domain/errors/User/UserAlreadyExistError';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';

/**
 * A place to determine the type of domain or app layer error, then changed it to http response.
 * If you create a new error class, make sure to add it here.
 */
export function errorHandler(error: any): IResponseDTO {
	console.log('error:', error);

	// place error class here
	const errors: { [code: string]: any[] } = {
		400: [PasswordIncorrectError],
		404: [UserNotFoundError],
		409: [UserAlreadyExistError],
	};

	// iteration each http code
	for (const errorCode in errors) {
		// iteration each error class
		for (const errorInstance of errors[errorCode]) {
			if (error instanceof errorInstance) {
				return {
					success: false,
					statusCode: parseInt(errorCode),
					error: { message: error.message },
				};
			}
		}
	}

	return {
		statusCode: 500,
		success: false,
		error: { message: 'Internal server error' },
	};
}
