export interface IErrorResponseAPI {
	success: false;
	statusCode: number;
	error: { message: string };
}

export interface IResponseAPI<Type> {
	success: true;
	statusCode: number;
	payload: Type;

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
