import type { RequestHandler } from '@sveltejs/kit';

import { createUserComposer } from '$lib/server/infra/services/User/CreateUser';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelte';

export const POST: RequestHandler = svelteAdapter(createUserComposer());
