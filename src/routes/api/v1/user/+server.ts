import type {RequestHandler} from '@sveltejs/kit';

import { updateBasicInfoComposer } from '$lib/server/infra/services/composer/User/UpdateBasicInfo';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';
import { getUserComposer } from '$lib/server/infra/services/composer/User/GetUser';

export const GET: RequestHandler = svelteHttpAdapter(getUserComposer())
export const PATCH: RequestHandler = svelteHttpAdapter(updateBasicInfoComposer())