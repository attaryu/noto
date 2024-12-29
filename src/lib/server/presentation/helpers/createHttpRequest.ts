import type { LibraryHttpRequest } from './interfaces/LibraryHttpRequest';
import type { IHttpRequest } from './interfaces/HttpRequest';

export async function createHttpRequest(event: LibraryHttpRequest): Promise<IHttpRequest> {
	const { request } = event;

	const httpRequest: IHttpRequest = {
		cookies: event.cookies,
		params: event.params,
		query: event.url.searchParams,
		url: event.url,
		method: request.method as any,
		headers: Object.fromEntries(request.headers.entries()),
	};

	if (request.body) {
		if (!request.body.locked) {
			event.locals.body = await request.json();
		}

		httpRequest.body = event.locals.body;
	}

	return httpRequest;
}
