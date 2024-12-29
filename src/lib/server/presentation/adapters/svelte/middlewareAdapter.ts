import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';
import type { Handle } from '@sveltejs/kit';
import type { IHttpRequest } from '../../helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '../../helpers/interfaces/HttpResponse';

import { createHttpRequest } from '../../helpers/createHttpRequest';

import { json, redirect } from '@sveltejs/kit';

export function svelteMiddlewareAdapter(middleware: IMiddleware): Handle {
	return async ({ event, resolve }) => {
		const httpRequest: IHttpRequest = await createHttpRequest(event);

		
		const response: IHttpResponse = {
			json,
			redirect,
		};
		
		const next = async () => await resolve(event);
		
		return await middleware.handle(httpRequest, response, next);
	};
}
