import type { IHttpRequest } from './interfaces/HttpRequest';
import type { LibraryHttpRequest } from './interfaces/LibraryHttpRequest';

/**
 * Creates an HTTP request object from a SvelteKit request event.
 *
 * @param event SvelteKit [RequestEvent](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent) object.
 */
export async function createHttpRequest(event: LibraryHttpRequest): Promise<IHttpRequest> {
	const httpRequest: IHttpRequest = {
		cookies: event.cookies,
		params: event.params,
		query: event.url.searchParams,
		url: event.url,
		method: event.request.method as any,
		headers: Object.fromEntries(event.request.headers.entries()),
		locals: event.locals,
	};

	// If the request has a body, parse it as JSON.
	if (event.request.body) {
		// If the body stream is unlocked, parse it as JSON and store it temporary in the locals.
		if (!event.request.body.locked) {
			/**
			 * This function is often called twice per request. First, when the request goes to the
			 * middleware. Then, the request goes to the controller. Therefore, we need to save the 
			 * parsing result to locals since the stream body can only be read once.
			 *
			 * @see https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/locked
			 */
			event.locals.body = await event.request.json();
		}

		httpRequest.body = event.locals.body;
	}

	return httpRequest;
}
