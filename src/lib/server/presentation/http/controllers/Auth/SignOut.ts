import type { ISignOut } from '$lib/server/app/use-cases/Auth/SignOut';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelte';
import type { IController } from '../Controller';

export class SignOutController implements IController {
	constructor(private readonly signOutCase: ISignOut) {}

	async handle(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
		try {
			const token = request.cookies.get('AUTH_TOKEN');

			if (!token) {
				return {
					statusCode: 400,
					success: false,
					error: { message: 'Token should be included in the cookie' },
				};
			}

			await this.signOutCase.execute(token);
		} catch (error: any) {
			// do something if needed
		}
    
		// No matter whether the token sent is or not in the database, always return success.
		// Unless the token is not included on the Cookie Request

		request.cookies.delete('AUTH_TOKEN', { path: '/' });

		return {
			statusCode: 204,
			success: true,
		};
	}
}
