import type { IResponseAPI } from '$lib/types/response';

export type ISignupPayload = {
	fullname: string;
	email: string;
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
};

export type ISignupResponse = IResponseAPI<{
	user: {
		id: string;
		email: string;
		fullname: string;
	};
}>;
