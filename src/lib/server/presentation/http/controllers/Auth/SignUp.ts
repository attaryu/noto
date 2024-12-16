import type { ISignUp } from '$lib/server/app/use-cases/Auth/SignUp';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelte';
import type { IController } from '../Controller';

import { errorHandler } from '../../errors/handler';

export class SignUpController implements IController {
	constructor(private readonly createSignUp: ISignUp) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
		try {
			if (!(request.body && Object.keys(request.body).length)) {
				return {
					statusCode: 400,
					success: false,
					error: { message: 'Request body cannot be empty!' },
				};
			}

			const newUser = await this.createSignUp.execute(request.body);

			return {
				statusCode: 200,
				success: true,
				payload: newUser,
			};
		} catch (error: any) {
			return errorHandler(error);
		}
	}
}
