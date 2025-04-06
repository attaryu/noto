import type { IDeleteNotes } from '$lib/server/app/use-cases/Note/DeleteNotes';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class DeleteNotesController implements IController {
	constructor(private readonly deleteNotesCase: IDeleteNotes) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const noteId = JSON.parse(request.query.get('noteId') ?? '[]');

		if (!noteId.length) {
			return response.json({
				statusCode: 400,
				success: false,
				error: { message: 'Note id is required at least one' },
			});
		}

		await this.deleteNotesCase.execute(noteId, request.locals!.tokenPayload!.userId);

		return response.json(null, { status: 204 });
	}
}
