import type { RequestHandler } from '@sveltejs/kit';

import { securityResetComposer } from '$lib/server/infra/services/composer/User/SecurityReset';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const PUT: RequestHandler = svelteHttpAdapter(securityResetComposer());
