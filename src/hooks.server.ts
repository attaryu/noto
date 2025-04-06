import { authorizationPagesMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/client/AuthorizationPageMiddleware';
import { bodyRequestMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/server/BodyRequestMiddleware';
import { sessionMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/server/SessionMiddleware';
import { tokenCheckMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/server/TokenCheckMiddleware';

import { sequenceProxy } from '$lib/utils/sequence';

export const handle = sequenceProxy(
	// server middleware
	bodyRequestMiddlewareComposer,
	tokenCheckMiddlewareComposer,
	sessionMiddlewareComposer,

	// client middleware
	authorizationPagesMiddlewareComposer,
);
