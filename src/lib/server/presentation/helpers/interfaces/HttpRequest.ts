import type { Cookies } from '@sveltejs/kit';

import type { ITokenPayloadDTO } from '$lib/server/domain/dtos/Token/CreateTokenPayload';
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
	locals?: {
		tokenPayload?: ITokenPayloadDTO;
		body?: any;
	};
}
