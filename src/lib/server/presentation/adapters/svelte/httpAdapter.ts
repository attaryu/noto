import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '../../helpers/interfaces/HttpRequest';
import type { IController } from '../../http/controllers/Controller';

import { json, redirect, type RequestHandler } from '@sveltejs/kit';

import { createHttpRequest } from '../../helpers/createHttpRequest';
import { errorHandler } from '../../http/errors/errorHandler';

export function svelteHttpAdapter(controller: IController): RequestHandler {
	return async (event): Promise<Response> => {
		let response: IResponseDTO;

		try {
			const httpRequest: IHttpRequest = await createHttpRequest(event);

			response = await controller.handler(httpRequest);
		} catch (error) {
			response = errorHandler(error);
		}

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
