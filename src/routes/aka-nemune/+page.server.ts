import type { PageServerLoad } from './$types';

import { getWords } from '$lib/getWords';

export const load = (async ({ fetch }) => {
	return { words: getWords(fetch) };
}) satisfies PageServerLoad;
