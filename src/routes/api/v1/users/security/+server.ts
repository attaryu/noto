import type { RequestHandler } from '@sveltejs/kit';

import { securityResetComposer } from '$lib/server/infra/services/User/SecurityReset';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelteAdapter';

export const PUT: RequestHandler = svelteAdapter(securityResetComposer());
