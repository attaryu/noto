import type { Cookies } from '@sveltejs/kit';
/**
 * HTTP Request from svelte
 */
export interface IHttpRequest {
	query: URLSearchParams;
	url: URL;
	cookies: Cookies;
	params?: any;
	headers?: Record<string, string>;
	body?: any;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}
