import type { RequestHandler } from '@sveltejs/kit';

import { requestAccountRecoveryComposer } from '$lib/server/infra/services/composer/User/RequestAccountRecovery';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const POST: RequestHandler = svelteHttpAdapter(requestAccountRecoveryComposer());
