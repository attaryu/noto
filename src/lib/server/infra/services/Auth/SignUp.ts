import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { CreateUser } from '$lib/server/app/use-cases/User/impements/CreateUser';
import { SignUpController } from '$lib/server/presentation/http/controllers/Auth/SignUp';
import { client } from '../../databases/mongodb/connection';
import { UserRepository } from '../../repositories/User';
import { PasswordHasher } from '../../providers/PasswordHasher';

export function signUpComposer(): IController {
	const useCase = new CreateUser(new UserRepository(client), new PasswordHasher());

	return new SignUpController(useCase);
}
