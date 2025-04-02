import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { GetUser } from '$lib/server/app/use-cases/User/impements/GetUser';
import { client } from '$lib/server/infra/databases/mongodb/connection';
import { UserRepository } from '$lib/server/infra/repositories/User';
import { GetUserController } from '$lib/server/presentation/http/controllers/User/GetUser';

export function getUserComposer(): IController {
	const useCase = new GetUser(new UserRepository(client));
	return new GetUserController(useCase);
}
