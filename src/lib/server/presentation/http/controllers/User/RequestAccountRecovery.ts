import type { IRequestAccountRecovery } from '$lib/server/app/use-cases/User/RequestAccountRecovery';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/HttpRequest';
import type { IController } from '../Controller';

export class RequestAccountRecoveryController implements IController {
	constructor(private readonly requestRecoveryEmailCase: IRequestAccountRecovery) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
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
