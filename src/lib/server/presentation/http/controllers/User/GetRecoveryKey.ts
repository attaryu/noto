import type { IGetRecoveryKey } from '$lib/server/app/use-cases/User/GetRecoveryKey';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '$lib/server/presentation/adapters/svelteAdapter';
import type { IController } from '../Controller';

export class GetRecoveryKeyController implements IController {
	constructor(private readonly getRecoveryKeyCase: IGetRecoveryKey) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO> {
		const { query } = request;
		const recoveryToken = query?.get('recovery-token');
		const keyOrder = query?.get('key-order');

		if (!(recoveryToken && keyOrder)) {
			return {
				statusCode: 400,
				success: false,
				error: { message: 'Recovery token or key order is not in the query' },
			};
		}

		const data = await this.getRecoveryKeyCase.execute(recoveryToken, keyOrder);

		request.cookies.set('RESET_TOKEN', data.token.value, {
			path: '/',
			expires: data.token.expiredAt,
			httpOnly: true,
			secure: true,
			sameSite: true,
		});

		return {
			statusCode: 200,
			success: true,
			payload: {
				recoveryKey: data.recoveryKey,
			},
		};
	}
}
