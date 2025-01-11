import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { GetLabels } from '$lib/server/app/use-cases/Label/implements/GetLabels';
import { client } from '$lib/server/infra/databases/mongodb/connection';
import { LabelRepository } from '$lib/server/infra/repositories/Label';
import { GetLabelsController } from '$lib/server/presentation/http/controllers/Label/GetLabels';

export function getLabelsComposer(): IController {
	const useCase = new GetLabels(new LabelRepository(client));

	return new GetLabelsController(useCase);
}
