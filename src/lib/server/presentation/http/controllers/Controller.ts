import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';

export interface IController {
	handler(request: IHttpRequest): Promise<IResponseDTO>;
}
