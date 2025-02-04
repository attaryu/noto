import type { AxiosError, AxiosResponse } from 'axios';

import { PUBLIC_API_VERSION } from '$env/static/public';
import axios from 'axios';

export const axiosFetch = new (class {
	private base = axios.create({
		baseURL: `/api/v${PUBLIC_API_VERSION}`,
		withCredentials: true,
	});

	private async request<Response, Payload = unknown>(
		method: 'get' | 'post' | 'put' | 'delete',
		pathname: string,
		payload?: Payload,
	) {
		try {
			const response = await this.base[method]<unknown, AxiosResponse<Response>, Payload>(
				pathname,
				payload ?? undefined,
			);

			return response.data;
		} catch (error: unknown) {
			const err = error as AxiosError<Response>;

			return err.response?.data;
		}
	}

	public async GET<Response>(pathname: string) {
		return this.request<Response>('get', pathname);
	}

	public async POST<Response, Payload = unknown>(pathname: string, payload: Payload) {
		return this.request<Response, Payload>('post', pathname, payload);
	}

	public async PUT<Response, Payload = unknown>(pathname: string, payload: Payload) {
		return this.request<Response, Payload>('put', pathname, payload);
	}

	public async DELETE<Response>(pathname: string) {
		return this.request<Response>('delete', pathname);
	}
})();
