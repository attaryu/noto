import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { ImportNotes } from '$lib/server/app/use-cases/Note/implements/ImportNotes';
import { client } from '$lib/server/infra/databases/mongodb/connection';
import { LabelRepository } from '$lib/server/infra/repositories/Label';
import { NoteRepository } from '$lib/server/infra/repositories/Note';
import { UserRepository } from '$lib/server/infra/repositories/User';
import { ImportNotesController } from '$lib/server/presentation/http/controllers/Note/ImportNotes';

export function importNotesComposer(): IController {
	const useCase = new ImportNotes(
		new NoteRepository(client),
		new LabelRepository(client),
		new UserRepository(client),
	);

	return new ImportNotesController(useCase);
}
