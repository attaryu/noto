import type { IController } from '$lib/server/presentation/http/controllers/Controller';

import { RequestAccountRecovery } from '$lib/server/app/use-cases/User/impements/RequestAccountRecovery';
import { RequestAccountRecoveryController } from '$lib/server/presentation/http/controllers/User/RequestAccountRecovery';
import { client } from '../../databases/mongodb/connection';
import { EmailSender } from '../../providers/EmailSender';
import { EmailTemplate } from '../../providers/EmailTemplate';
import { TokenManager } from '../../providers/TokenManager';
import { TokenRepository } from '../../repositories/Token';
import { UserRepository } from '../../repositories/User';

export function requestAccountRecoveryComposer(): IController {
	const usecase = new RequestAccountRecovery(
		new UserRepository(client),
		new TokenRepository(client),
		new EmailSender(),
		new EmailTemplate(),
		new TokenManager(),
	);

	return new RequestAccountRecoveryController(usecase);
}
