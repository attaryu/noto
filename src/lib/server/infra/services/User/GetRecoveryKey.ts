import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { GetRecoveryKey } from '$lib/server/app/use-cases/User/impements/GetRecoveryKey';
import { GetRecoveryKeyController } from '$lib/server/presentation/http/controllers/User/GetRecoveryKey';
import { client } from '../../databases/mongodb/connection';
import { TokenManager } from '../../providers/TokenManager';
import { TokenRepository } from '../../repositories/Token';
import { UserRepository } from '../../repositories/User';

export function getRecoveryKeyComposer(): IController {
	const useCase = new GetRecoveryKey(
		new TokenRepository(client),
		new UserRepository(client),
		new TokenManager(),
	);

	return new GetRecoveryKeyController(useCase);
}
