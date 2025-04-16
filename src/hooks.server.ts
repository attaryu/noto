import type { Handle } from '@sveltejs/kit';

import { sequence } from '@sveltejs/kit/hooks';

import { authorizationPagesMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/client/AuthorizationPageMiddleware';
import { bodyRequestMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/server/BodyRequestMiddleware';
import { sessionMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/server/SessionMiddleware';
import { tokenCheckMiddlewareComposer } from '$lib/server/infra/services/composer/Middleware/server/TokenCheckMiddleware';

import { svelteMiddlewareAdapter } from '$lib/server/presentation/adapters/svelte/middlewareAdapter';
import { paraglideMiddleware } from './paraglide/server';

/**
 * paraglide server hook
 * 
 * @see https://inlang.com/m/gerre34r/library-inlang-paraglideJs/sveltekit#add-the-paraglidemiddleware-to-srchooksserverts
 */
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale),
		});
	});

export const handle = sequence(
	// 3rd party middleware
	paraglideHandle,

	// server middleware
	svelteMiddlewareAdapter(bodyRequestMiddlewareComposer()),
	svelteMiddlewareAdapter(tokenCheckMiddlewareComposer()),
	svelteMiddlewareAdapter(sessionMiddlewareComposer()),

	// client middleware
	svelteMiddlewareAdapter(authorizationPagesMiddlewareComposer()),
);
