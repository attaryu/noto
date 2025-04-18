import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { UpdateNote } from '$lib/server/app/use-cases/Note/implements/UpdateNote';
import { LabelRepository } from '$lib/server/infra/repositories/Label';
import { UpdateNoteController } from '$lib/server/presentation/http/controllers/Note/UpdateNote';
import { client } from '../../../databases/mongodb/connection';
import { NoteRepository } from '../../../repositories/Note';

export function updateNoteComposer(): IController {
	const useCase = new UpdateNote(new NoteRepository(client), new LabelRepository(client));

	return new UpdateNoteController(useCase);
}
