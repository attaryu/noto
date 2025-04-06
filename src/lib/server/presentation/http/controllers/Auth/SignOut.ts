import type { IDeleteSession } from '$lib/server/app/use-cases/Session/DeleteSesion';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class SignOutController implements IController {
	constructor(private readonly deleteSessionCase: IDeleteSession) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		try {
			const token = request.cookies.get('AUTH_TOKEN');
			await this.deleteSessionCase.execute(token!);
		} catch (error: any) {
			console.log(' error:', error);
		}

		// No matter whether the token sent is or not in the database, always return success.
		// Unless the token is not included on the Cookie Request

		response.cookies.delete('AUTH_TOKEN', { path: '/' });

		return response.json(null, { status: 204 });
	}
}
