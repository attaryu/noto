import type { RequestHandler } from './$types';

import { exportNotesComposer } from '$lib/server/infra/services/composer/Note/ExportNotes';
import { svelteHttpAdapter } from '$lib/server/presentation/adapters/svelte/httpAdapter';

export const GET: RequestHandler = svelteHttpAdapter(exportNotesComposer());
