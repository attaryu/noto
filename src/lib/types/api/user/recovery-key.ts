import type { IResponseAPI } from '$lib/types/response';

export type IRecoveryKeyResponse = IResponseAPI<{
	recoveryKey: {
		code: string;
		value: string;
		iv: string;
		salt: string;
	};
}>;
