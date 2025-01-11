import type { IGetLabels } from '$lib/server/app/use-cases/Label/GetLabels';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class GetLabelsController implements IController {
	constructor(private readonly getLabelsCase: IGetLabels) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const data = await this.getLabelsCase.execute(request.locals!.tokenPayload!.id);

		return {
			statusCode: 200,
			success: true,
			payload: {
				labels: data,
			},
		};
	}
}
