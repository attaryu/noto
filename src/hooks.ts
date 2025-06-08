import type { Reroute } from '@sveltejs/kit';

import { deLocalizeUrl } from './paraglide/runtime';

/**
 * paraglide reroute hook
 * 
 * @see https://inlang.com/m/gerre34r/library-inlang-paraglideJs/sveltekit#add-a-reroute-hook-in-srchooksts
 */
export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
