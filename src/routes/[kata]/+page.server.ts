import type { PageServerLoad } from './$types';

import { getWords } from '$lib/getWords';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params, setHeaders }) => {
	const words = await getWords(fetch, setHeaders);
	const word = words.find(word => word.word === params.kata);

	if (!word) throw error(404, 'Word not found');

	return { word };
}) satisfies PageServerLoad;
