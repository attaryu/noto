import type { RequestHandler } from '@sveltejs/kit';

import { requestAccountRecoveryComposer } from '$lib/server/infra/services/User/RequestAccountRecovery';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelteAdapter';

export const POST: RequestHandler = svelteAdapter(requestAccountRecoveryComposer());
