import { z } from 'zod';

const fullname = z
	.string()
	.min(4, 'Fullname must be at least 4 characters long')
	.max(32, 'Fullname must be at most 32 characters long');

const email = z.string().email('Invalid email address');

const password = z.string().min(8, 'Password must be at least 8 characters long');

export const signupUserValidator = z
	.object({
		fullname,
		email,
		password,
		repeatPassword: password,
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "Passwords did'nt match",
		path: ['repeatPassword'],
	});

export const signinUserValidator = z.object({
	email,
	password,
});

export const accountRecoveryValidator = z.object({
	email,
});

export const resetPasswordValidator = z.object({
	password,
	repeatPassword: password,
});

export const updateUserValidator = z.object({
	fullname,
	email,
});
