import type { Cookies } from '@sveltejs/kit';

import type { IResponseDTO } from '$lib/server/domain/dtos/Response';

/**
 * Interface for HTTP response.
 */
export interface IHttpResponse {
	cookies: Cookies;
	json: (data: IResponseDTO | null, init?: ResponseInit | undefined) => Response;
	redirect: (
		status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308,
		location: string | URL,
	) => Response;
}
