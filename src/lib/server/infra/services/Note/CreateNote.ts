import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { CreateNote } from '$lib/server/app/use-cases/Note/implements/CreateNote';
import { CreateNoteController } from '$lib/server/presentation/http/controllers/Note/CreateNote';
import { client } from '../../databases/mongodb/connection';
import { TokenManager } from '../../providers/TokenManager';
import { NoteRepository } from '../../repositories/Note';
import { UserRepository } from '../../repositories/User';

export function createNoteComposer(): IController {
	const useCase = new CreateNote(new NoteRepository(client), new UserRepository(client));

	return new CreateNoteController(useCase, new TokenManager());
}
