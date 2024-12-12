import type { ICreateUser } from '$lib/server/app/use-cases/User/CreateUser';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelte';
import type { IController } from '../Controller';

import { UserAlreadyExistError } from '$lib/server/domain/errors/User/UserAlreadyExistError';
import { errorResponse } from '$lib/server/infra/helper/errorResponse';

export class SignUpController implements IController {
	constructor(private readonly createUserCase: ICreateUser) {}

	async handle(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
		try {
			if (!(request.body && Object.keys(request.body).length)) {
				return {
					statusCode: 400,
					success: false,
					error: { message: 'Request body cannot be empty!' },
				};
			}

			const newUser = await this.createUserCase.execute(request.body);

			return {
				statusCode: 200,
				success: true,
				payload: newUser,
			};
		} catch (error: any) {
			if (error instanceof UserAlreadyExistError) {
				return {
					statusCode: 409,
					success: false,
					error: { message: error.message },
				};
			}

			return errorResponse();
		}
	}
}
