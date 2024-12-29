import type { IHttpRequest } from './interfaces/HttpRequest';
import type { LibraryHttpRequest } from './interfaces/LibraryHttpRequest';

export async function createHttpRequest(event: LibraryHttpRequest): Promise<IHttpRequest> {
	const httpRequest: IHttpRequest = {
		cookies: event.cookies,
		params: event.params,
		query: event.url.searchParams,
		url: event.url,
		method: event.request.method as any,
		headers: Object.fromEntries(event.request.headers.entries()),
	};

	if (event.request.body) {
		if (!event.request.body.locked) {
			event.locals.body = await event.request.json();
		}

		httpRequest.body = event.locals.body;
	}

	return httpRequest;
}
