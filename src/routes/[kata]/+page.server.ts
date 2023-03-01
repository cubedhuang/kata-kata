import type { PageServerLoad } from './$types';

import { getWords } from '$lib/getWords';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params, setHeaders }) => {
	setHeaders({
		'Cache-Control': 'max-age=300, public'
	});

	const words = await getWords(fetch);
	const word = words.find(
		word => word.word === params.kata || word.wordi === params.kata
	);

	if (!word) throw error(404, 'Word not found');

	return { word };
}) satisfies PageServerLoad;
