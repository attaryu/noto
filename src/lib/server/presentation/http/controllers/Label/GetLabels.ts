import type { IGetLabels } from '$lib/server/app/use-cases/Label/GetLabels';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class GetLabelsController implements IController {
	constructor(private readonly getLabelsCase: IGetLabels) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const data = await this.getLabelsCase.execute(request.locals!.tokenPayload!.user.id!);

		return response.json({
			statusCode: 200,
			success: true,
			payload: {
				labels: data,
			},
		});
	}
}
