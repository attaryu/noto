import { bodyRequestMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/BodyRequestMiddleware';
import { sessionMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/SessionMiddleware';
import { tokenCheckMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/TokenCheckMiddleware';

import { sequenceProxy } from '$lib/utils/sequence';

export const handle = sequenceProxy(
	bodyRequestMiddlewareComposer,
	tokenCheckMiddlewareComposer,
	sessionMiddlewareComposer,
);
