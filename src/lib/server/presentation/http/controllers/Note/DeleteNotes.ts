import type { IDeleteNotes } from '$lib/server/app/use-cases/Note/DeleteNotes';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class DeleteNotesController implements IController {
	constructor(private readonly deleteNotesCase: IDeleteNotes) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const noteId = JSON.parse(request.query.get('noteId') ?? '[]');
		const userId = request.locals!.tokenPayload!.id;

		if (!noteId.length) {
			return {
				statusCode: 400,
				success: false,
				error: { message: 'Note id is required at least one' },
			};
		}

		await this.deleteNotesCase.execute(noteId, userId);

		return {
			statusCode: 204,
			success: true,
		};
	}
}
