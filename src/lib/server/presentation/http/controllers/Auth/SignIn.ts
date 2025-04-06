import type { ICreateSession } from '$lib/server/app/use-cases/Session/CreateSession';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class SignInController implements IController {
	constructor(private readonly signInCase: ICreateSession) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const { user, ...data } = await this.signInCase.execute(request.body);

		response.cookies.set('AUTH_TOKEN', data.token, {
			path: '/',
			expires: data.expiredAt,
			httpOnly: true,
			secure: true,
			sameSite: true,
		});

		return response.json({
			statusCode: 201,
			success: true,
			payload: {
				user: {
					id: user!.id,
					fullname: user!.fullname,
					email: user!.email,
					secretKey: user!.secretKey,
				},
			},
		});
	}
}
