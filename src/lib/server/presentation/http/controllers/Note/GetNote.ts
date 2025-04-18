import type { IGetNote } from '$lib/server/app/use-cases/Note/GetNote';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class GetNoteController implements IController {
	constructor(private readonly getNoteCase: IGetNote) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const result = await this.getNoteCase.execute(
			request.locals!.tokenPayload!.userId,
			request.params.noteId,
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
