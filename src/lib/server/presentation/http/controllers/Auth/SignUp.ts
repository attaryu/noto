import type { ICreateUser } from '$lib/server/app/use-cases/User/CreateUser';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class SignUpController implements IController {
	constructor(private readonly createSignUp: ICreateUser) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const newUser = await this.createSignUp.execute(request.body);

		return response.json({
			statusCode: 200,
			success: true,
			payload: {
				user: newUser,
			},
		});
	}
}
