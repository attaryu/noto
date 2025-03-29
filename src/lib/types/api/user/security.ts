import type { IResponseAPI } from '$lib/types/response';

export interface IUserSecurityPayload {
	password: {
		value: string;
		salt: string;
	};
	secretKey: {
		value: string;
		iv: string;
	};
	recoveryKeys: Array<{
		code: string;
		value: string;
		salt: string;
		iv: string;
	}>;
}

export type IUserSecurityResponse = IResponseAPI<{
	user: {
		id: string;
		username: string;
		email: string;
	};
}>;
