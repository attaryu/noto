import type { RequestHandler } from '@sveltejs/kit';

import { requestAccountRecoveryComposer } from '$lib/server/infra/services/User/RequestAccountRecovery';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const POST: RequestHandler = svelteHttpAdapter(requestAccountRecoveryComposer());
