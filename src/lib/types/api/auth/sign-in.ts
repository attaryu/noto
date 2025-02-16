import type { IResponseAPI } from '$lib/types/response';

export interface ISigninPayload {
	email: string;
	password: string;
}

export type ISigninResponse = IResponseAPI<{
	user: {
		id: string;
		email: string;
		fullname: string;
		secretKey: {
			value: string;
			iv: string;
		};
	};
}>;
