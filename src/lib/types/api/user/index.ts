import type { IResponseAPI } from '$lib/types/response';

export type IGetUserResponse = IResponseAPI<{
	user: {
		id: string;
		fullname: string;
		email: string;
		secretKey: {
			value: string;
			iv: string;
		};
	};
}>;

export interface IUpdateUserBasicInfoPayload {
	fullname: string;
	email: string;
}

export type IUpdateUserBasicInfoResponse = IResponseAPI<{
	user: {
		id: string;
		fullname: string;
		email: string;
	};
}>;
