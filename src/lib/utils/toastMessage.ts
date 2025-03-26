import type { IToast } from '$lib/stores/toast.svelte';
import type { IErrorResponseAPI } from '$lib/types/response';

/**
 * Generates a toast message for a general http error response
 *
 * @param errorResponse http error response object
 * @param action action to display if the error is a server error
 */
export function generateToastHTTPError(
	errorResponse: IErrorResponseAPI,
	action: IToast['action'],
): Omit<IToast, 'id' | 'timeout'> {
	const isServerError = errorResponse.statusCode >= 500;

	return {
		message: isServerError ? 'Server error' : errorResponse.error.message,
		action: isServerError ? action : undefined,
		type: 'error',
	};
}
