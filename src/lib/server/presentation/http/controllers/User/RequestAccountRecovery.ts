import type { IRequestAccountRecovery } from '$lib/server/app/use-cases/User/RequestAccountRecovery';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class RequestAccountRecoveryController implements IController {
	constructor(private readonly requestRecoveryEmailCase: IRequestAccountRecovery) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		await this.requestRecoveryEmailCase.execute(request.body.email);

		return response.json({
			statusCode: 200,
			success: true,
		});
	}
}
