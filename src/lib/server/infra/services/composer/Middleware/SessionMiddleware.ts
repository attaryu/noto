import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';

import { SessionMiddleware } from '$lib/server/infra/middlewares/implements/SessionMiddleware';
import { TokenManager } from '$lib/server/infra/providers/TokenManager';

export function sessionMiddlewareComposer(): IMiddleware {
	return new SessionMiddleware(new TokenManager());
}
