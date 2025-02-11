import { z } from 'zod';

export interface IUser {
	id: string;
	fullname: string;
	email: string;
}

export const createUserInputDTO = z.object({
	fullname: z
		.string()
		.min(4, 'Fullname must be at least 4 characters long')
		.max(32, 'Fullname must be at most 32 characters long'),
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.max(32, 'Password must be at most 32 characters long'),
	repeatPassword: z
		.string()
		.min(8, 'Repeat Password must be at least 8 characters long')
		.max(32, 'Repeat Password must be at most 32 characters long'),
});

export type ICreateUserInputDTO = z.infer<typeof createUserInputDTO>;

export interface ICreateUserDTO {
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
}
