import type { RequestHandler } from '@sveltejs/kit';

import { getRecoveryKeyComposer } from '$lib/server/infra/services/User/GetRecoveryKey';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const GET: RequestHandler = svelteHttpAdapter(getRecoveryKeyComposer());
