import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { CreateUser } from '$lib/server/app/use-cases/User/impements/CreateUser';
import { SignUpController } from '$lib/server/presentation/http/controllers/Auth/SignUp';
import { client } from '../../databases/mongodb/connection';
import { UserRepository } from '../../repositories/User';

export function signUpComposer(): IController {
	const repository = new UserRepository(client);
	const useCase = new CreateUser(repository);
	const controller = new SignUpController(useCase);

	return controller;
}
