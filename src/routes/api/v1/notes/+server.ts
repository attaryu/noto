import { createNoteComposer } from '$lib/server/infra/services/Note/CreateNote';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = svelteHttpAdapter(createNoteComposer());
