import type { IPagination } from './Pagination';

export interface IResponseDTO {
	/**
	 * Indicate that response is success or failed
	 */
	success: boolean;

	/**
	 * HTTP code
	 */
	statusCode: number;

	/**
	 * Transport the requested data if needed
	 */
	payload?: any;

	/**
	 * Contains error details when it happens
	 */
	error?: any;

	/**
	 * URL to redirect when the response leads to other sources
	 */
	redirect?: any;

	/**
	 * Paginations metadata
	 */
	pagination?: IPagination;
}
