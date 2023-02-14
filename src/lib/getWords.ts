import parser from 'papaparse';

import type { Word } from './types';

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

export async function getWords(
	fetch: (
		input: RequestInfo | URL,
		init?: RequestInit | undefined
	) => Promise<Response>,
	setHeaders: (headers: Record<string, string>) => void
) {
	const response = await fetch(SHEET).then(res => res.text());

	const csv = parser.parse(response).data as string[][];

	csv.shift();
	csv.shift();
	csv.shift();

	const words = [];
	let currentCategory = '';

	for (const row of csv) {
		row.shift();

		if (!row[0]) continue;

		if (!row[1]) {
			currentCategory = row[0];
			continue;
		}

		const word = {
			category: currentCategory
		} as Word;

		for (const [i, cell] of row.entries()) {
			if (!cell) continue;

			word[keys[i]] = cell;
		}

		words.push(word);
	}

	setHeaders({
		'Cache-Control': 'max-age=60, public'
	});

	return words;
}
