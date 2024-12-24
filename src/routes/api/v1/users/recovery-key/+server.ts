import type { RequestHandler } from '@sveltejs/kit';

import { getRecoveryKeyComposer } from '$lib/server/infra/services/User/GetRecoveryKey';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelte';

export const GET: RequestHandler = svelteAdapter(getRecoveryKeyComposer());
