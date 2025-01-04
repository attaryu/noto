import type { RequestHandler } from '@sveltejs/kit';

import { signOutComposer } from '$lib/server/infra/services/composer/Auth/SignOut';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const DELETE: RequestHandler = svelteHttpAdapter(signOutComposer());
