import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';
import type { Handle } from '@sveltejs/kit';
import type { IHttpRequest } from '../../helpers/HttpRequest';
import type { IHttpResponse } from '../../helpers/HttpResponse';

import { json, redirect } from '@sveltejs/kit';

export function svelteMiddlewareAdapter(middleware: IMiddleware): Handle {
	return async ({ event, resolve }) => {
		const request: IHttpRequest = {
			cookies: event.cookies,
			params: event.params,
			query: event.url.searchParams,
			url: event.url,
		};

		const response: IHttpResponse = {
			json,
			redirect,
		};

		const next = async () => await resolve(event);

		return await middleware.handle(request, response, next);
	};
}
