import type { ITokenRepository } from '$lib/server/app/repositories/Token';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IMiddleware } from '../Middleware';

import { TokenError } from '$lib/server/domain/errors/Token';
import { API_VERSION } from '$env/static/private';

export class TokenCheckMiddleware implements IMiddleware {
	constructor(private readonly tokenRepository: ITokenRepository) {}

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
			const token = request.cookies.get('AUTH_TOKEN') ?? request.cookies.get('RESET_TOKEN');

			if (token) {
				const existingToken = await this.tokenRepository.getSessionByToken(token);

				if (!existingToken) {
					throw new TokenError.NotRegistered();
				}
			}
		}

		return next();
	}
}
