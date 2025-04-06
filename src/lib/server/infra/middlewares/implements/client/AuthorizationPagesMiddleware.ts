import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IMiddleware } from '../../Middleware';

import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenError } from '$lib/server/domain/errors/Token';

export class AuthorizationPagesMiddleware implements IMiddleware {
	private protectedPaths = ['/app/notes', '/app/backup', '/app/profile'];

	constructor(private readonly tokenManager: ITokenManager) {}

	async handle(
		request: IHttpRequest,
		response: IHttpResponse,
		next: () => Promise<Response>,
	): Promise<Response> {
		const { pathname } = request.url;

		await Promise.all(
			this.protectedPaths.map(async (path) => {
				if (pathname.startsWith(path)) {
					const authToken = request.cookies.get('AUTH_TOKEN');

					try {
						if (!authToken) {
							throw new TokenError.NotIncluded();
						}

						const payload = await this.tokenManager.verify(authToken);

						if (payload.purpose !== TokenPurposeEnum.session) {
							throw new TokenError.Purpose();
						}
					} catch {
						return response.redirect(302, '/app/sign-in');
					}
				}
			}),
		);

		return next();
	}
}
