import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { TokenManager } from '$lib/server/infra/providers/TokenManager';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('AUTH_TOKEN');

	if (!token) {
		return;
	}

	const tokenManager = new TokenManager();

	try {
		await tokenManager.verify(token);
	} catch {}

	return redirect(302, '/app/notes');
};
