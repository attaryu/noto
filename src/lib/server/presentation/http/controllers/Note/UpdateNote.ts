// TODO: make UpdateNoteController

import type { IUpdateNote } from '$lib/server/app/use-cases/Note/UpdateNote';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class UpdateNoteController implements IController {
	constructor(private readonly updateNoteCase: IUpdateNote) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const noteId = request.params.noteId;
		const userId = request.locals!.tokenPayload!.id;
		const body = request.body;

		const result = await this.updateNoteCase.execute(userId, noteId, body);

		return {
			statusCode: 200,
			success: true,
			payload: {
				note: result,
			},
		};
	}
}
