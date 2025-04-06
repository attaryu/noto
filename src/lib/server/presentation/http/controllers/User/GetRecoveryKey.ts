import type { IGetRecoveryKey } from '$lib/server/app/use-cases/User/GetRecoveryKey';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class GetRecoveryKeyController implements IController {
	constructor(private readonly getRecoveryKeyCase: IGetRecoveryKey) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const { query } = request;

		const recoveryToken = query.get('recovery-token');
		const keyOrder = query.get('key-order');

		if (!(recoveryToken && keyOrder)) {
			return response.json({
				statusCode: 400,
				success: false,
				error: { message: 'Recovery token or key order is not in the query' },
			});
		}

		const data = await this.getRecoveryKeyCase.execute(recoveryToken, keyOrder);

		request.cookies.set('RESET_TOKEN', data.token.value, {
			path: '/',
			expires: data.token.expiredAt,
			httpOnly: true,
			secure: true,
			sameSite: true,
		});

		return response.json({
			statusCode: 200,
			success: true,
			payload: {
				recoveryKey: data.recoveryKey,
			},
		});
	}
}
