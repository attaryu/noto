import type { IResponseDTO } from '$lib/server/domain/dtos/Response';

import { NoteError } from '$lib/server/domain/errors/Note';
import { TokenError } from '$lib/server/domain/errors/Token';
import { UserError } from '$lib/server/domain/errors/User';
import { MongoDBError } from '$lib/server/infra/errors/MongoDB';

/**
 * A place to determine the type of domain or app layer error, then changed it to http response.
 * If you create a new error class, make sure to add it here.
 */
export function errorHandler(error: any): IResponseDTO {
	console.error(error);

	// ? place error class here
	const errors: { [code: string]: any[] } = {
		400: [
			UserError.PasswordIncorrect,
			TokenError.Purpose,
			UserError.Entity,
			NoteError.Entity,
			NoteError.Pin,
			NoteError.Content,
			MongoDBError.InvalidId,
			NoteError.AmountExceeded,
			NoteError.AlreadyDeleted,
			TokenError.NotIncluded,
		],
		401: [TokenError.Invalid, NoteError.UnauthorizedOwner],
		404: [
			UserError.NotFound,
			TokenError.NotRegistered,
			UserError.RecoveryKeyIncorrect,
			NoteError.NotFound,
		],
		409: [UserError.AlreadyExist],
	};

	// ? iteration each http code
	for (const errorCode in errors) {
		// ? iteration each error class
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
