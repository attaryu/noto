import type {RequestHandler} from '@sveltejs/kit';

import { updateBasicInfoComposer } from '$lib/server/infra/services/composer/User/UpdateBasicInfo';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const PATCH: RequestHandler = svelteHttpAdapter(updateBasicInfoComposer())