import { z } from 'zod';
import { m } from 'paraglide/messages';

const fullname = z
	.string()
	.min(4, m['common.validation.min_length']({ field: m['common.fields.fullname'](), length: 4 }))
	.max(32, m['common.validation.max_length']({ field: m['common.fields.fullname'](), length: 32 }));

const email = z.string().email(m['user_validation.email.invalid']());

const password = z
	.string()
	.min(8, m['common.validation.min_length']({ field: m['common.fields.password'](), length: 8 }));

export const signupUserValidator = z
	.object({
		fullname,
		email,
		password,
		repeatPassword: password,
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: m['user_validation.password.not_match'](),
		path: ['repeatPassword'],
	});

export const signinUserValidator = z.object({
	email,
	password,
});

export const accountRecoveryValidator = z.object({
	email,
});

export const resetPasswordValidator = z
	.object({
		password,
		repeatPassword: password,
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: m['user_validation.password.not_match'](),
		path: ['repeatPassword'],
	});

export const updateUserValidator = z.object({
	fullname,
	email,
});
