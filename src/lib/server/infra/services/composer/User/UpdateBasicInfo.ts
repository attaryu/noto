import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { UpdateBasicInfo } from '$lib/server/app/use-cases/User/impements/UpdateBasicInfo';
import { client } from '$lib/server/infra/databases/mongodb/connection';
import { UserRepository } from '$lib/server/infra/repositories/User';
import { UpdateBasicInfoController } from '$lib/server/presentation/http/controllers/User/UpdateBasicInfo';

export function updateBasicInfoComposer(): IController {
	const useCase = new UpdateBasicInfo(new UserRepository(client));
	return new UpdateBasicInfoController(useCase);
}
