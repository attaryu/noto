import type { ISecurityReset } from '$lib/server/app/use-cases/User/SecurityReset';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class SecurityResetController implements IController {
	constructor(private readonly securityResetCase: ISecurityReset) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const token = request.cookies.get('RESET_TOKEN');

		if (!token) {
			return {
				statusCode: 400,
				success: false,
				error: { message: 'token should be included in the cookie' },
			};
		}

		const result = await this.securityResetCase.execute(token, request.body);

		request.cookies.delete('RESET_TOKEN', { path: '/' });

		return {
			statusCode: 201,
			success: true,
			payload: {
				user: result,
			},
		};
	}
}
