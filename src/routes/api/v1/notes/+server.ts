import type { RequestHandler } from '@sveltejs/kit';

import { createNoteComposer } from '$lib/server/infra/services/Note/CreateNote';
import { getNotesComposer } from '$lib/server/infra/services/Note/GetNotes';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const GET: RequestHandler = svelteHttpAdapter(getNotesComposer());
export const POST: RequestHandler = svelteHttpAdapter(createNoteComposer());
