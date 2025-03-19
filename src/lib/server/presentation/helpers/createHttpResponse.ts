import { json } from '@sveltejs/kit';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpResponse } from './interfaces/HttpResponse';
import type { LibraryHttpRequest } from './interfaces/LibraryHttpRequest';

/**
 * Creates an HTTP response object from a SvelteKit request event.
 *
 * @param event SvelteKit [RequestEvent](https://svelte.dev/docs/kit/@sveltejs-kit#RequestEvent) object.
 */
export function createHttpResponse(event: LibraryHttpRequest): IHttpResponse {
	return {
		cookies: event.cookies,
		json: (data, init) => {
			if (data?.statusCode === 204 || init?.status === 204) {
				return new Response(null, {
					status: 204,
				});
			}

			return json(data, {
				...init,
				status: data?.statusCode ?? init?.status ?? 200,
			});
		},
		redirect: (status, location) =>
			new Response(null, {
				status,
				headers: { Location: typeof location === 'string' ? location : location.toString() },
			}),
	};
}
