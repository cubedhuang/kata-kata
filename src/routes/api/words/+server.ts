import { text } from '@sveltejs/kit';
import { parse } from 'csv-parse/sync';

import type { Word } from '$lib/types';
import type { RequestHandler } from './$types';

const SHEET =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-xdwfzK86O86JlDqrKUNWZCUuMq5fdu5os7EB79VfY9NiTY6Q5_a_uaJ07YIOFeaulTmYfhz77Nnt/pub?gid=0&single=true&output=csv';

const keys = [
	'word',
	'partOfSpeech',
	'meaning',
	'creator',
	'sourceLanguage',
	'sourceWord',
	'sourceTransliteration',
	'sourceDefinition'
] as const;

export const GET = (async ({ fetch, setHeaders }) => {
	const response = await fetch(SHEET).then(res => res.text());

	const csv = parse(response, {
		skip_empty_lines: true
	}) as string[][];

	csv.shift();
	csv.shift();
	csv.shift();

	const words = [];

	for (const row of csv) {
		row.shift();

		if (!row[0]) continue;

		const word: Word = {} as Word;

		for (const [i, cell] of row.entries()) {
			if (!cell) continue;

			word[keys[i]] = cell;
		}

		words.push(word);
	}

	setHeaders({
		'Cache-Control': 'max-age=60, public'
	});

	return text(JSON.stringify(words, null, 2));
}) satisfies RequestHandler;
