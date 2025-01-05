import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IMiddleware } from '../Middleware';

import { API_VERSION } from '$env/static/private';
import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenError } from '$lib/server/domain/errors/Token';

export class SessionMiddleware implements IMiddleware {
	constructor(private readonly tokenManager: ITokenManager) {}

	async handle(
		request: IHttpRequest,
		response: IHttpResponse,
		next: () => Promise<Response>,
	): Promise<Response> {
		const { pathname } = request.url;
		const basePathname = `/api/v${API_VERSION}`;

		if (
			pathname.startsWith(`${basePathname}/notes`) ||
			pathname.startsWith(`${basePathname}/note`) ||
			pathname === `${basePathname}/auth/sign-out`
		) {
			const token = request.cookies.get('AUTH_TOKEN');

			if (!token) {
				throw new TokenError.NotIncluded();
			}

			request.locals!.tokenPayload = await this.tokenManager.verify(token);

			if (request.locals!.tokenPayload.purpose !== TokenPurposeEnum.session) {
				throw new TokenError.Purpose();
			}
		}

		return next();
	}
}
