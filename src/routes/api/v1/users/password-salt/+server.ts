import type { RequestHandler } from '@sveltejs/kit';

import { getSaltComposer } from '$lib/server/infra/services/User/GetSalt';
import { svelteAdapter } from '$lib/server/presentation/adapters/svelteAdapter';

export const GET: RequestHandler = svelteAdapter(getSaltComposer());
