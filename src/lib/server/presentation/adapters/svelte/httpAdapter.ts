import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '../../helpers/interfaces/HttpRequest';
import type { IController } from '../../http/controllers/Controller';

import { json, redirect, type RequestHandler } from '@sveltejs/kit';

import { createHttpRequest } from '../../helpers/createHttpRequest';
import { errorHandler } from '../../http/errors/errorHandler';
import { createHttpResponse } from '../../helpers/createHttpResponse';

export function svelteHttpAdapter(controller: IController): RequestHandler {
	return async (event): Promise<Response> => {
		let response: Response;
		const httpResponse = createHttpResponse(event);

		try {
			response = await controller.handler(await createHttpRequest(event), httpResponse);
		} catch (error) {
			response = errorHandler(httpResponse, error);
		}

		return response;
	};
}
