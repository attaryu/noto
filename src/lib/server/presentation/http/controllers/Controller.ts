import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest, IHttpResponse } from '../../adapters/svelteAdapter';

export interface IController {
	handler(request: IHttpRequest, response: IHttpResponse): Promise<IResponseDTO>;
}
