import type { RequestHandler } from '@sveltejs/kit';

import { signInComposer } from '$lib/server/infra/services/composer/Auth/SignIn';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const POST: RequestHandler = svelteHttpAdapter(signInComposer());
