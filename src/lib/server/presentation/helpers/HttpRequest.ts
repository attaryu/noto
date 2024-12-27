import type { Cookies } from '@sveltejs/kit';

/**
 * HTTP Request from svelte
 */
export interface IHttpRequest {
	params?: any;
	query?: URLSearchParams;
	headers?: Record<string, string>;
	body?: any;
	url?: URL,
	cookies?: Cookies;
}
