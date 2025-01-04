import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { DeleteNotes } from '$lib/server/app/use-cases/Note/implements/DeleteNotes';
import { DeleteNotesController } from '$lib/server/presentation/http/controllers/Note/DeleteNotes';
import { client } from '../../../databases/mongodb/connection';
import { NoteRepository } from '../../../repositories/Note';

export function deleteNotesComposer(): IController {
	const useCase = new DeleteNotes(new NoteRepository(client));
	return new DeleteNotesController(useCase);
}
