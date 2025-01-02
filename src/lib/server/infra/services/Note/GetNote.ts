import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { GetNote } from '$lib/server/app/use-cases/Note/implements/GetNote';
import { GetNoteController } from '$lib/server/presentation/http/controllers/Note/GetNote';
import { client } from '../../databases/mongodb/connection';
import { NoteRepository } from '../../repositories/Note';

export function getNoteComposer(): IController {
	const useCase = new GetNote(new NoteRepository(client));
	return new GetNoteController(useCase);
}
