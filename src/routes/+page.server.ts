import type { PageServerLoad } from './$types';

import { getWords } from '$lib/getWords';

export const load = (async ({ fetch, setHeaders }) => {
	return {
		words: await getWords(fetch, setHeaders)
	};
}) satisfies PageServerLoad;
