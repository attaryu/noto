export interface IPagination {
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
}
