import type { RequestHandler } from '@sveltejs/kit';

import { getNoteComposer } from '$lib/server/infra/services/Note/GetNote';
import { updateNoteComposer } from '$lib/server/infra/services/Note/UpdateNote';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

// TODO[GetNote]: Routing
export const GET: RequestHandler = svelteHttpAdapter(getNoteComposer());

export const PATCH: RequestHandler = svelteHttpAdapter(updateNoteComposer());
