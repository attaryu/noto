import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { TokenManager } from '$lib/server/infra/providers/TokenManager';

export const load: LayoutServerLoad = async ({ cookies, url, fetch }) => {
	const token = cookies.get('AUTH_TOKEN');

	if (token) {
		if (url.searchParams.get('action') === 'sign-out') {
			await fetch('/api/v1/auth/sign-out', { method: 'DELETE', credentials: 'same-origin' });

			return;
		}

		try {
			await new TokenManager().verify(token);
		} catch {
			return;
		}

		return redirect(302, '/app/notes');
	}

	return;
};
