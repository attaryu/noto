import type { PageServerLoad } from './$types.js';

import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return redirect(307, '/app/notes');
};
