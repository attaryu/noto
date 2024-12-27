import type { Handle } from '@sveltejs/kit';

import { SessionMiddleware } from '$lib/server/infra/middlewares/implements/SessionMiddleware';
import { svelteMiddlewareAdapter } from '$lib/server/presentation/adapters/svelte/middlewareAdapter';

export const handle: Handle = svelteMiddlewareAdapter(new SessionMiddleware());
