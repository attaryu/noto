import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';

import { client } from '$lib/server/infra/databases/mongodb/connection';
import { TokenCheckMiddleware } from '$lib/server/infra/middlewares/implements/TokenCheckMiddleware';
import { TokenRepository } from '$lib/server/infra/repositories/Token';

export function tokenCheckMiddlewareComposer(): IMiddleware {
	return new TokenCheckMiddleware(new TokenRepository(client));
}
