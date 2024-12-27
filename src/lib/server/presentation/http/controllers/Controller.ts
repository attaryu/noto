import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '../../helpers/HttpRequest';

export interface IController {
	handler(request: IHttpRequest): Promise<IResponseDTO>;
}
