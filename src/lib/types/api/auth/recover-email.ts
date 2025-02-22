import type { IResponseAPI } from '$lib/types/response';

export interface IRecoverEmailPayload {
	email: string;
}

export type IRecoverEmailResponse = IResponseAPI<undefined>;
