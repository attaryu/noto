import type { IRequestAccountRecovery } from '$lib/server/app/use-cases/User/RequestAccountRecovery';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class RequestAccountRecoveryController implements IController {
	constructor(private readonly requestRecoveryEmailCase: IRequestAccountRecovery) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		await this.requestRecoveryEmailCase.execute(request.body.email);

		return {
			statusCode: 200,
			success: true,
		};
	}
}
