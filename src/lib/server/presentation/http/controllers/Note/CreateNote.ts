import type { ICreateNote } from '$lib/server/app/use-cases/Note/CreateNote';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class CreateNoteController implements IController {
	constructor(private readonly createNoteCase: ICreateNote) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const result = await this.createNoteCase.execute({
			...request.body,
			userId: request.locals!.tokenPayload!.userId,
		});

		return response.json({
			statusCode: 201,
			success: true,
			payload: {
				note: result,
			},
		});
	}
}
