import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { DeleteSession } from '$lib/server/app/use-cases/Session/implements/DeleteSession';
import { SignOutController } from '$lib/server/presentation/http/controllers/Auth/SignOut';
import { client } from '../../databases/mongodb/connection';
import { TokenRepository } from '../../repositories/Token';

export function signOutComposer(): IController {
	const useCase = new DeleteSession(new TokenRepository(client));

	return new SignOutController(useCase);
}
