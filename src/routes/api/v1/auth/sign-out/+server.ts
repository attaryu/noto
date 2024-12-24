import type { RequestHandler } from '@sveltejs/kit';

import { signOutComposer } from '$lib/server/infra/services/Auth/SignOut';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelteAdapter';

export const DELETE: RequestHandler = svelteAdapter(signOutComposer());
