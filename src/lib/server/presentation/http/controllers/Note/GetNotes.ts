import type { IGetNotes } from '$lib/server/app/use-cases/Note/GetNotes';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class GetNotesController implements IController {
	constructor(private readonly getNotesCase: IGetNotes) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const label = request.query.get('label');
		const offset = request.query.get('offset');
		const search = request.query.get('search');
		const archived = request.query.get('archived');

		const result = await this.getNotesCase.execute(request.locals!.tokenPayload!.user.id!, {
			label: label ?? undefined,
			offset: offset ? parseInt(offset) : undefined,
			search: search && JSON.parse(search),
			archived: Boolean(archived ?? false),
		});

		return response.json({
			statusCode: 200,
			success: true,
			payload: {
				notes: result.data,
			},
			pagination: result.metadata,
		});
	}
}
