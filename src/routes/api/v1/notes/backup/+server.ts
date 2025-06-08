import type { RequestHandler } from './$types';

import { exportNotesComposer } from '$lib/server/infra/services/composer/Note/ExportNotes';
import { importNotesComposer } from '$lib/server/infra/services/composer/Note/ImportNotes';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const GET: RequestHandler = svelteHttpAdapter(exportNotesComposer());
export const POST: RequestHandler = svelteHttpAdapter(importNotesComposer());
