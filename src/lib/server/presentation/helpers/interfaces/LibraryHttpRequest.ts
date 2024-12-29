import type { RequestEvent } from '@sveltejs/kit';

/**
 * HttpRequet form from library
 */
export type LibraryHttpRequest = RequestEvent<Partial<Record<string, string>>, string | null>;
