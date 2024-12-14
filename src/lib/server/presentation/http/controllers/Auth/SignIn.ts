import type { ISignIn } from '$lib/server/app/use-cases/Auth/SignIn';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelte';
import type { IController } from '../Controller';

import { errorHandler } from '../../errors/handler';

export class SignInController implements IController {
	constructor(private readonly signInCase: ISignIn) {}

	async handle(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
		try {
			if (!(request.body && Object.keys(request.body).length)) {
				return {
					statusCode: 400,
					success: false,
					error: { message: 'Request body cannot be empty!' },
				};
			}

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
						id: user.id,
						fullname: user.fullname,
						email: user.email,
					},
				},
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
