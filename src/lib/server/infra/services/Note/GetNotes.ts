import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { GetNotes } from '$lib/server/app/use-cases/Note/implements/GetNotes';
import { GetNotesController } from '$lib/server/presentation/http/controllers/Note/GetNotes';
import { client } from '../../databases/mongodb/connection';
import { NoteRepository } from '../../repositories/Note';

export function getNotesComposer(): IController {
	const useCase = new GetNotes(new NoteRepository(client));
	return new GetNotesController(useCase);
}
