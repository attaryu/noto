import { SignIn } from '$lib/server/app/use-cases/Auth/implements/SignIn';
import { SignInController } from '$lib/server/presentation/http/controllers/Auth/SignIn';
import type { IController } from '$lib/server/presentation/http/controllers/Controller';
import { client } from '../../databases/mongodb/connection';
import { PasswordHasher } from '../../providers/PasswordHasher';
import { TokenManager } from '../../providers/TokenManager';
import { SessionRepository } from '../../repositories/Session';
import { UserRepository } from '../../repositories/User';

export function signInComposer(): IController {
	const useCase = new SignIn(
		new UserRepository(client),
		new SessionRepository(client),
		new TokenManager(),
		new PasswordHasher(),
	);

	return new SignInController(useCase);
}
