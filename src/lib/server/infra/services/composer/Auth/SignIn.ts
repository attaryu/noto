import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { CreateSession } from '$lib/server/app/use-cases/Session/implements/CreateSession';
import { SignInController } from '$lib/server/presentation/http/controllers/Auth/SignIn';
import { client } from '../../../databases/mongodb/connection';
import { PasswordHasher } from '../../../providers/PasswordHasher';
import { TokenManager } from '../../../providers/TokenManager';
import { TokenRepository } from '../../../repositories/Token';
import { UserRepository } from '../../../repositories/User';

export function signInComposer(): IController {
	const useCase = new CreateSession(
		new UserRepository(client),
		new TokenRepository(client),
		new TokenManager(),
		new PasswordHasher(),
	);

	return new SignInController(useCase);
}
