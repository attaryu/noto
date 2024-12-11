export interface IResponseDTO {
	success: boolean;
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
}
