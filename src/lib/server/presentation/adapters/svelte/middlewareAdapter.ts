import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';
import type { Handle } from '@sveltejs/kit';
import type { IHttpRequest } from '../../helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '../../helpers/interfaces/HttpResponse';

import { json } from '@sveltejs/kit';

import { createHttpRequest } from '../../helpers/createHttpRequest';
import { errorHandler } from '../../http/errors/errorHandler';

export function svelteMiddlewareAdapter(middleware: IMiddleware): Handle {
	return async ({ event, resolve }) => {
		const httpRequest: IHttpRequest = await createHttpRequest(event);
		const httpResponse: IHttpResponse = {
			json,
			redirect: (statusCode, location) =>
				new Response(null, {
					status: statusCode,
					headers: {
						location,
					},
				}),
		};

		const next = async () => await resolve(event);

		let response: Response;

		try {
			response = await middleware.handle(httpRequest, httpResponse, next);
		} catch (error) {
			const errorResult = errorHandler(error);
			response = json(errorResult, { status: errorResult.statusCode });
		}

		return response;
	};
}
