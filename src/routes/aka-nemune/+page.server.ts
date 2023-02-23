import type { PageServerLoad } from './$types';

import { getWords } from '$lib/getWords';

export const load = (async ({ fetch, setHeaders }) => {
	setHeaders({
		'Cache-Control': 'max-age=300, public'
	});

	return { words: getWords(fetch) };
}) satisfies PageServerLoad;
