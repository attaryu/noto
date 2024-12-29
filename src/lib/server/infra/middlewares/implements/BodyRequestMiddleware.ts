import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IMiddleware } from '../Middleware';

export class BodyRequestMiddleware implements IMiddleware {
	async handle(
		request: IHttpRequest,
		response: IHttpResponse,
		next: () => Promise<Response>,
	): Promise<Response> {
		const { method, body } = request;

		if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
			if (!(body && Object.keys(body).length)) {
				return response.json(
					{
						statusCode: 400,
						success: false,
						error: { message: 'request body cannot be empty!' },
					},
					{ status: 400 },
				);
			}
		}

		return next();
	}
}
