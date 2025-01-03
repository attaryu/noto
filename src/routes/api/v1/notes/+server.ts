import type { RequestHandler } from '@sveltejs/kit';

import { createNoteComposer } from '$lib/server/infra/services/Note/CreateNote';
import { getNotesComposer } from '$lib/server/infra/services/Note/GetNotes';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';
import { deleteNotesComposer } from '$lib/server/infra/services/Note/DeleteNotes';

export const GET: RequestHandler = svelteHttpAdapter(getNotesComposer());
export const POST: RequestHandler = svelteHttpAdapter(createNoteComposer());
// TODO[DeleteNotes]: routing
export const DELETE: RequestHandler = svelteHttpAdapter(deleteNotesComposer());
