import type { LayoutLoad } from './$types';

import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

import { secretKeyManagement } from '$lib/business/secretKeyManagement';

export const load: LayoutLoad = async () => {
	const secretKey = browser ? await secretKeyManagement.getSecretKey() : undefined;

	if (browser && !secretKey) {
		redirect(302, '/app/sign-in?action=sign-out');
	}

	return { secretKey };
};
