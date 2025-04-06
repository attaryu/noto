import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { SecurityReset } from '$lib/server/app/use-cases/User/impements/SecurityReset';
import { SecurityResetController } from '$lib/server/presentation/http/controllers/User/SecurityReset';
import { client } from '../../../databases/mongodb/connection';
import { PasswordHasher } from '../../../providers/PasswordHasher';
import { TokenManager } from '../../../providers/TokenManager';
import { TokenRepository } from '../../../repositories/Token';
import { UserRepository } from '../../../repositories/User';

export function securityResetComposer(): IController {
	const useCase = new SecurityReset(
		new UserRepository(client),
		new TokenRepository(client),
		new TokenManager(),
		new PasswordHasher(),
	);

	return new SecurityResetController(useCase);
}
