import type { ICreateSession } from '$lib/server/app/use-cases/Session/CreateSession';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class SignInController implements IController {
	constructor(private readonly signInCase: ICreateSession) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const { user, ...data } = await this.signInCase.execute(request.body);

		request.cookies.set('AUTH_TOKEN', data.token, {
			path: '/',
			expires: data.expiredAt,
			httpOnly: true,
			secure: true,
			sameSite: true,
		});

		return {
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
		};
	}
}
