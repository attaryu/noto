import type { IUpdateNote } from '$lib/server/app/use-cases/Note/UpdateNote';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class UpdateNoteController implements IController {
	constructor(private readonly updateNoteCase: IUpdateNote) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const result = await this.updateNoteCase.execute(
			request.locals!.tokenPayload!.userId,
			request.params.noteId,
			request.body,
		);

		return response.json({
			statusCode: 200,
			success: true,
			payload: {
				note: result,
			},
		});
	}
}
