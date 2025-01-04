import type { RequestHandler } from '@sveltejs/kit';

import { createNoteComposer } from '$lib/server/infra/services/composer/Note/CreateNote';
import { getNotesComposer } from '$lib/server/infra/services/composer/Note/GetNotes';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';
import { deleteNotesComposer } from '$lib/server/infra/services/composer/Note/DeleteNotes';

export const GET: RequestHandler = svelteHttpAdapter(getNotesComposer());
export const POST: RequestHandler = svelteHttpAdapter(createNoteComposer());
// TODO[DeleteNotes]: routing
export const DELETE: RequestHandler = svelteHttpAdapter(deleteNotesComposer());
