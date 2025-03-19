import type { IGetSalt } from '$lib/server/app/use-cases/User/GetSalt';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class GetSaltController implements IController {
	constructor(private readonly getSaltUseCase: IGetSalt) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const email = request.query?.get('email');

		if (!email) {
			return response.json({
				statusCode: 400,
				success: false,
				error: { message: 'Request query must have an email and there is a value!' },
			});
		}

		const salt = await this.getSaltUseCase.execute(email);

		return response.json({
			statusCode: 200,
			success: true,
			payload: { salt },
		});
	}
}
