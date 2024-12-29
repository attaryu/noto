import type { Handle } from '@sveltejs/kit';

import { SessionMiddleware } from '$lib/server/infra/middlewares/implements/SessionMiddleware';
import { svelteMiddlewareAdapter } from '$lib/server/presentation/adapters/svelte/middlewareAdapter';
import { BodyRequestMiddleware } from '$lib/server/infra/middlewares/implements/BodyRequestMiddleware';
import { sequence } from '@sveltejs/kit/hooks';

const sessionMiddleware: Handle = svelteMiddlewareAdapter(new SessionMiddleware());
const bodyRequestMiddleware: Handle = svelteMiddlewareAdapter(new BodyRequestMiddleware());

export const handle = sequence(bodyRequestMiddleware, sessionMiddleware);
