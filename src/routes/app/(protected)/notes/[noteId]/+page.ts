import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => ({ noteId: params.noteId });
