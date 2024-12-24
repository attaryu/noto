import type { IRequestAccountRecovery } from '$lib/server/app/use-cases/User/RequestAccountRecovery';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelteAdapter';
import type { IController } from '../Controller';

export class RequestAccountRecoveryController implements IController {
	constructor(private readonly requestRecoveryEmailCase: IRequestAccountRecovery) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
		const { body } = request;

		if (!(body && Object.keys(body).length)) {
			return {
				statusCode: 400,
				success: false,
				error: { message: 'Request body cannot be empty!' },
			};
		}

		await this.requestRecoveryEmailCase.execute(body.email);

		return {
			statusCode: 200,
			success: true,
		};
	}
}
