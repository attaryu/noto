import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';
import type { Handle } from '@sveltejs/kit';
import type { IHttpResponse } from '../../helpers/interfaces/HttpResponse';

import { createHttpRequest } from '../../helpers/createHttpRequest';
import { createHttpResponse } from '../../helpers/createHttpResponse';
import { errorHandler } from '../../http/errors/errorHandler';

export function svelteMiddlewareAdapter(middleware: IMiddleware): Handle {
	return async ({ event, resolve }) => {
		const httpResponse: IHttpResponse = createHttpResponse(event);
		const next = async () => await resolve(event);

		let response: Response;

		try {
			response = await middleware.handle(await createHttpRequest(event), httpResponse, next);
		} catch (error) {
			response = errorHandler(httpResponse, error);
		}

		return response;
	};
}
