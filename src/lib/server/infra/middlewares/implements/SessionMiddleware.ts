import type { IHttpRequest } from '$lib/server/presentation/helpers/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/HttpResponse';
import type { IMiddleware } from '../Middleware';

import { API_VERSION } from '$env/static/private';
import { errorHandler } from '$lib/server/presentation/http/errors/errorHandler';
import { TokenManager } from '../../providers/TokenManager';

export class SessionMiddleware implements IMiddleware {
	async handle(
		request: IHttpRequest,
		response: IHttpResponse,
		next: () => Promise<Response>,
	): Promise<Response> {
		const { pathname } = request.url!;
		const basePathname = `/api/v${API_VERSION}`;

		if (
			pathname.startsWith(`${basePathname}/notes`) ||
			pathname.startsWith(`${basePathname}/note`) ||
			pathname === `${basePathname}/auth/sign-out`
		) {
			try {
				const token = request.cookies!.get('AUTH_TOKEN');

				if (!token) {
					return response.json(
						{
							success: false,
							statusCode: 400,
							error: { message: 'token was not found in the request' },
						},
						{ status: 400 },
					);
				}

				await new TokenManager().verify(token);
			} catch (error) {
				const result = errorHandler(error);
				return response.json(result, { status: result.statusCode });
			}
		}

		return next();
	}
}
