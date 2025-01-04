import type { IMiddleware } from '$lib/server/infra/middlewares/Middleware';

import { sequence } from '@sveltejs/kit/hooks';

import { svelteMiddlewareAdapter } from '$lib/server/presentation/adapters/svelte/middlewareAdapter';

export function sequenceProxy(...middlewares: (() => IMiddleware)[]) {
	return sequence(...middlewares.map((middleware) => svelteMiddlewareAdapter(middleware())));
}
