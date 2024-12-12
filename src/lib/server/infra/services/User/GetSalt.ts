import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { GetSalt } from '$lib/server/app/use-cases/User/impements/GetSalt';
import { GetSaltController } from '$lib/server/presentation/http/controllers/User/GetSalt';
import { client } from '../../databases/mongodb/connection';
import { UserRepository } from '../../repositories/User';

export function getSaltComposer(): IController {
	const repositories = new UserRepository(client);
	const useCase = new GetSalt(repositories);
	const controller = new GetSaltController(useCase);

	return controller;
}
