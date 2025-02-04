export interface IResponseAPI<Type> {
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
	payload?: Type;

	/**
	 * Contains error details when it happens
	 */
	error?: { message: string };

	/**
	 * URL to redirect when the response leads to other sources
	 */
	redirect?: any;

	/**
	 * Paginations metadata
	 */
	pagination?: {
		/**
		 * The last offset of the data taken
		 */
		offset: number;

		/**
		 * The maximum amount of data sent in one request
		 */
		limit: number;

		/**
		 * Actual amount of data that saved in server
		 */
		total: number;
	};
}
