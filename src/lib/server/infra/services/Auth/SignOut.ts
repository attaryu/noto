import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { SignOut } from '$lib/server/app/use-cases/Auth/implements/SignOut';
import { SignOutController } from '$lib/server/presentation/http/controllers/Auth/SignOut';
import { client } from '../../databases/mongodb/connection';
import { SessionRepository } from '../../repositories/Session';

export function signOutComposer(): IController {
	const useCase = new SignOut(new SessionRepository(client));

	return new SignOutController(useCase);
}
