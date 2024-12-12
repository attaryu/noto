import type { IResponseDTO } from '$lib/server/domain/dtos/Response';

export const errorResponse = (): IResponseDTO => ({
	statusCode: 500,
	success: false,
	error: { message: 'Internal server error' },
});
