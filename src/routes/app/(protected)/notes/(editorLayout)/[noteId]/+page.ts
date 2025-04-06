import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { secretKey } = await parent();

	return { noteId: params.noteId, secretKey };
};
