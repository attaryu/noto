import type { RequestHandler } from '@sveltejs/kit';

import { signUpComposer } from '$lib/server/infra/services/Auth/SignUp';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const POST: RequestHandler = svelteHttpAdapter(signUpComposer());
