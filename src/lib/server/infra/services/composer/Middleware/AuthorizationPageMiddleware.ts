import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';

import { AuthorizationPagesMiddleware } from '$lib/server/infra/middlewares/implements/AuthorizationPagesMiddleware';
import { TokenManager } from '$lib/server/infra/providers/TokenManager';

export function authorizationPagesMiddlewareComposer(): IMiddleware {
	return new AuthorizationPagesMiddleware(new TokenManager());
}
