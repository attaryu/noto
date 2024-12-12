import type { RequestHandler } from '@sveltejs/kit';

import { signUpComposer } from '$lib/server/infra/services/Auth/SignUp';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelte';

export const POST: RequestHandler = svelteAdapter(signUpComposer());
