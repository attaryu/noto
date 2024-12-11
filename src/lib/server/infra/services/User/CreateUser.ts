import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { CreateUser } from '$lib/server/app/use-cases/User/impements/CreateUser';
import { CreateUserController } from '$lib/server/presentation/http/controllers/User/CreateUser';
import { client } from '../../databases/mongodb/connection';
import { UserRepository } from '../../repositories/User';

export function createUserComposer(): IController {
	const repository = new UserRepository(client);
	const useCase = new CreateUser(repository);
	const controller = new CreateUserController(useCase);

	return controller;
}
