import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { RequestEvent } from '@sveltejs/kit';
import type { IHttpRequest } from '../../helpers/HttpRequest';
import type { IController } from '../../http/controllers/Controller';

import { json, redirect } from '@sveltejs/kit';

import { errorHandler } from '../../http/errors/errorHandler';

export type SvelteHttpRequest = RequestEvent<Partial<Record<string, string>>, string | null>;

export function svelteHttpAdapter(controller: IController) {
	return async ({ request, params, url, cookies }: SvelteHttpRequest): Promise<Response> => {
		const httpRequest: IHttpRequest = {
			headers: Object.fromEntries(request.headers.entries()),
			cookies,
			params,
			query: url.searchParams,
		};

		if (request.body) {
			httpRequest.body = await request.json();
		}

		let response: IResponseDTO;

		try {
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
