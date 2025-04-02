import type { IGetUser } from '$lib/server/app/use-cases/User/GetUser';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class GetUserController implements IController {
	constructor(private readonly getUserCase: IGetUser) {}

	public async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const user = await this.getUserCase.execute(request.locals!.tokenPayload!.userId);

		return response.json({
			statusCode: 200,
			success: true,
			payload: { user },
		});
	}
}
