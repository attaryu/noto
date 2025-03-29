import type { IResponseAPI } from '$lib/types/response';

export type IPasswordSaltResponse = IResponseAPI<{ salt: string }>;
