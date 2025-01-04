import type { RequestHandler } from '@sveltejs/kit';

import { getSaltComposer } from '$lib/server/infra/services/composer/User/GetSalt';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const GET: RequestHandler = svelteHttpAdapter(getSaltComposer());
