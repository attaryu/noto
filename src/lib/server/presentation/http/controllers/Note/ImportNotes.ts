import type { IImportBackup } from '$lib/server/app/use-cases/Note/ImportNotes';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class ImportNotesController implements IController {
	constructor(private readonly importNotes: IImportBackup) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		await this.importNotes.execute(request.body, request.locals!.tokenPayload!.userId);

		return response.json({ success: true, statusCode: 200 });
	}
}
