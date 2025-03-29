import type { IResponseAPI } from '$lib/types/response';

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
