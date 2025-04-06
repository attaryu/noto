import type { PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { TokenPurposeEnum } from '$lib/server/domain/enums/TokenPurpose';
import { TokenManager } from '$lib/server/infra/providers/TokenManager';

/**
 * This load function is checking the token reset in the cookies
 * If the token is not found, it will redirect to the first step
 */
export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const token = cookies.get('RESET_TOKEN');

		if (!token) {
			throw new Error('Reset token not found');
		}

		const tokenManager = new TokenManager();
		const tokenPayload = await tokenManager.verify(token);

		if (tokenPayload.purpose !== TokenPurposeEnum.resetPassword) {
			throw new Error('Invalid token purpose');
		}

		return;
	} catch {
		return redirect(302, '/app/account-recovery/step-1');
	}
};
