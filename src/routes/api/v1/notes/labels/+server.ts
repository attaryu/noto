import type { RequestHandler } from '@sveltejs/kit';

import { getLabelsComposer } from '$lib/server/infra/services/composer/Label/GetLabels';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const GET: RequestHandler = svelteHttpAdapter(getLabelsComposer());
