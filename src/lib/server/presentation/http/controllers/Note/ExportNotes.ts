import type { IExportBackup } from '$lib/server/app/use-cases/Note/ExportNotes';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class ExportNotesController implements IController {
	constructor(private readonly exportNotesCase: IExportBackup) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const backup = await this.exportNotesCase.execute(request.locals!.tokenPayload!.userId);

		return response.json({
			statusCode: 200,
			success: true,
			payload: { backup },
		});
	}
}
