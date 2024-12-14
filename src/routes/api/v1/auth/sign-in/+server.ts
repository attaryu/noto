import type { RequestHandler } from '@sveltejs/kit';

import { signInComposer } from '$lib/server/infra/services/Auth/SignIn';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelte';

export const POST: RequestHandler = svelteAdapter(signInComposer());
