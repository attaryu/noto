import type { RequestHandler } from '@sveltejs/kit';

import { getNoteComposer } from '$lib/server/infra/services/composer/Note/GetNote';
import { updateNoteComposer } from '$lib/server/infra/services/composer/Note/UpdateNote';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const GET: RequestHandler = svelteHttpAdapter(getNoteComposer());
export const PATCH: RequestHandler = svelteHttpAdapter(updateNoteComposer());
