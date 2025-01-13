import type { ICreateUser } from '$lib/server/app/use-cases/User/CreateUser';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class SignUpController implements IController {
	constructor(private readonly createSignUp: ICreateUser) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const newUser = await this.createSignUp.execute(request.body);

		return {
			statusCode: 200,
			success: true,
			payload: {
				user: newUser,
			},
		};
	}
}
