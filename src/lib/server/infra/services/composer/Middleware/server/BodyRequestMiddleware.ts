import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';

import { BodyRequestMiddleware } from '$lib/server/infra/middlewares/implements/server/BodyRequestMiddleware';

export function bodyRequestMiddlewareComposer(): IMiddleware {
	return new BodyRequestMiddleware();
}
