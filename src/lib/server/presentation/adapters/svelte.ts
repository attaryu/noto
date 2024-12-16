import type { IController } from '../http/controllers/Controller';

import { json, redirect, type Cookies, type RequestEvent } from '@sveltejs/kit';

export type SvelteHttpRequest = RequestEvent<Partial<Record<string, string>>, string | null>;

/**
 * HTTP Request from svelte
 */
export interface IHttpRequest {
	params?: any;
	query?: URLSearchParams;
	headers: Record<string, string>;
	body?: any;
	cookies: Cookies;
}

/**
 * HTTP Response from svelte
 */
export interface IHttpResponse {
	setHeaders: (headers: Record<string, string>) => void;
}

export function svelteAdapter(controller: IController) {
	return async ({
		request,
		params,
		url,
		setHeaders,
		cookies,
	}: SvelteHttpRequest): Promise<Response> => {
		const httpRequest: IHttpRequest = {
			headers: Object.fromEntries(request.headers.entries()),
			cookies,
			params,
			query: url.searchParams,
		};

		if (request.body) {
			httpRequest.body = await request.json();
		}

		const httpResponse: IHttpResponse = {
			setHeaders,
		};

		const response = await controller.handler(httpRequest, httpResponse);
		const { statusCode } = response;

		if (statusCode >= 300 && statusCode < 400) {
			return redirect(statusCode, response.redirect);
		}

		if (statusCode === 204) {
			return new Response(null, { status: statusCode });
		}

		return json(response, { status: statusCode });
	};
}
