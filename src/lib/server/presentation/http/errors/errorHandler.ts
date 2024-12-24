import type { IResponseDTO } from '$lib/server/domain/dtos/Response';

import { TokenInvalidError } from '$lib/server/domain/errors/Token/TokenInvalidError';
import { TokenNotFoundError } from '$lib/server/domain/errors/Token/TokenNotFoundError';
import { TokenPurposeError } from '$lib/server/domain/errors/Token/TokenPurposeError';
import { PasswordIncorrectError } from '$lib/server/domain/errors/User/PasswordIncorrectError';
import { RecoveryKeyNotFoundError } from '$lib/server/domain/errors/User/RecoverKeyNotFoundError';
import { UserAlreadyExistError } from '$lib/server/domain/errors/User/UserAlreadyExistError';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';

/**
 * A place to determine the type of domain or app layer error, then changed it to http response.
 * If you create a new error class, make sure to add it here.
 */
export function errorHandler(error: any): IResponseDTO {
	// ? place error class here
	const errors: { [code: string]: any[] } = {
		400: [PasswordIncorrectError, TokenPurposeError],
		401: [TokenInvalidError],
		404: [UserNotFoundError, TokenNotFoundError, RecoveryKeyNotFoundError],
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
