import type { IHttpRequest } from '$lib/server/presentation/helpers/HttpRequest';
import type { IHttpResponse } from '$lib/server/presentation/helpers/HttpResponse';

export interface IMiddleware {
	handle(
		request: IHttpRequest,
		response: IHttpResponse,
		next: () => Promise<Response>,
	): Promise<Response>;
}
