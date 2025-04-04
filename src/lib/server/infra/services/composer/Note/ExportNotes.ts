import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { ExportNotes } from '$lib/server/app/use-cases/Note/implements/ExportNotes';
import { client } from '$lib/server/infra/databases/mongodb/connection';
import { LabelRepository } from '$lib/server/infra/repositories/Label';
import { NoteRepository } from '$lib/server/infra/repositories/Note';
import { UserRepository } from '$lib/server/infra/repositories/User';
import { ExportNotesController } from '$lib/server/presentation/http/controllers/Note/ExportNotes';

export function exportNotesComposer(): IController {
	const useCase = new ExportNotes(
		new NoteRepository(client),
		new LabelRepository(client),
		new UserRepository(client),
	);

	return new ExportNotesController(useCase);
}
