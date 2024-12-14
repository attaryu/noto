import type { IPasswordHasher } from '$lib/server/app/providers/PasswordHasher';

import { HASH_ROUND } from '$env/static/private';
import { compare, hash } from 'bcrypt';

export class PasswordHasher implements IPasswordHasher {
	async hash(password: string): Promise<string> {
		return await hash(password, parseInt(HASH_ROUND));
	}

	async compare(password: string, hashedPassword: string): Promise<boolean> {
		return await compare(password, hashedPassword);
	}
}
