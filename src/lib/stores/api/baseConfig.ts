import type { AxiosResponse } from 'axios';

import { PUBLIC_API_VERSION } from '$env/static/public';
import axios from 'axios';

class AxiosFetch {
	private base = axios.create({
		baseURL: `/api/v${PUBLIC_API_VERSION}`,
		withCredentials: true,
	});

	private async request<Response, Payload = unknown>(
		method: 'get' | 'post' | 'put' | 'delete' | 'patch',
		pathname: string,
		payload?: Payload,
	) {
		return this.base[method]<unknown, AxiosResponse<Response>, Payload>(
			pathname,
			payload ?? undefined,
		)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error.response?.data));
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

	public async PATCH<Response, Payload = unknown>(pathname: string, payload: Payload) {
		return this.request<Response, Payload>('patch', pathname, payload);
	}

	public async DELETE<Response>(pathname: string) {
		return this.request<Response>('delete', pathname);
	}
}

export const axiosFetch = new AxiosFetch();
