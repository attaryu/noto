import type { ICreateUser } from '$lib/server/app/use-cases/User/CreateUser';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelteAdapter';
import type { IController } from '../Controller';

export class SignUpController implements IController {
	constructor(private readonly createSignUp: ICreateUser) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
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
	}
}
