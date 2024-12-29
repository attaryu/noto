import type { IResponseDTO } from '$lib/server/domain/dtos/Response';

export interface IHttpResponse {
	json: (data: IResponseDTO, init?: ResponseInit | undefined) => Response;
	redirect: (
		status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308,
		location: string | URL,
	) => any;
}
