import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { TokenManager } from '$lib/server/infra/providers/TokenManager';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const authToken = cookies.get('AUTH_TOKEN');

	try {
		if (!authToken) {
			throw new Error('No token found');
		}

		const tokenManager = new TokenManager();
		const payload = await tokenManager.verify(authToken);

		return {
			user: payload.user,
		};
	} catch {
		redirect(302, '/app/sign-in?action=sign-out');
	}
};
