import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { CreateNote } from '$lib/server/app/use-cases/Note/implements/CreateNote';
import { LabelRepository } from '$lib/server/infra/repositories/Label';
import { CreateNoteController } from '$lib/server/presentation/http/controllers/Note/CreateNote';
import { client } from '../../../databases/mongodb/connection';
import { NoteRepository } from '../../../repositories/Note';
import { UserRepository } from '../../../repositories/User';

export function createNoteComposer(): IController {
	const useCase = new CreateNote(
		new NoteRepository(client),
		new UserRepository(client),
		new LabelRepository(client),
	);

	return new CreateNoteController(useCase);
}
