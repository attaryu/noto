// TODO: add UpdateNote endpoint here

import type { RequestHandler } from '@sveltejs/kit';

import { updateNoteComposer } from '$lib/server/infra/services/Note/UpdateNote';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const PATCH: RequestHandler = svelteHttpAdapter(updateNoteComposer());
