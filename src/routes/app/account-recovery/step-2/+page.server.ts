import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenManager } from '$lib/server/infra/providers/TokenManager';
import type { PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	// get token from query params, this token received in the user email
	const token = url.searchParams.get('token');

	try {
		if (!token) {
			throw new Error('Token not found');
		}

		const tokenManager = new TokenManager();
		const payload = await tokenManager.verify(token);

		if (payload.purpose !== TokenPurposeEnum.recoveryEmail) {
			throw new Error('Invalid token');
		}

		return { token };
	} catch {
		return redirect(302, '/app/account-recovery/step-1');
	}
};
