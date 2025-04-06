import type { IUpdateBasicInfo } from '$lib/server/app/use-cases/User/UpdateBasicInfo';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/interfaces/HttpResponse';
import type { IController } from '../Controller';

export class UpdateBasicInfoController implements IController {
	constructor(private readonly updateBasicInfoUseCase: IUpdateBasicInfo) {}

	async handler(request: IHttpRequest, response: IHttpResponse): Promise<Response> {
		const result = await this.updateBasicInfoUseCase.execute(
			request.locals!.tokenPayload!.userId,
			request.body,
		);

		return response.json({
			statusCode: 200,
			success: true,
			payload: {
				user: {
					id: result.id,
					fullname: result.fullname,
					email: result.email,
				},
			},
		});
	}
}
