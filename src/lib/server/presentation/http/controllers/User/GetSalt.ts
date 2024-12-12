import type { IGetSalt } from '$lib/server/app/use-cases/User/GetSalt';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import { UserNotFoundError } from '$lib/server/domain/errors/User/UserNotFoundError';
import { errorResponse } from '$lib/server/infra/helper/errorResponse';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelte';
import type { IController } from '../Controller';

export class GetSaltController implements IController {
	constructor(private readonly getSaltUseCase: IGetSalt) {}

	async handle(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
		try {
			const email = request.query?.get('email');

			if (!email) {
				return {
					statusCode: 400,
					success: false,
					error: { message: 'Request query must have an email and there is a value!' },
				};
			}

			const salt = await this.getSaltUseCase.execute(email);

			return {
				statusCode: 200,
				success: true,
				payload: { salt },
			};
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return {
					statusCode: 404,
					success: false,
					error: { message: error.message },
				};
			}

			return errorResponse();
		}
	}
}
