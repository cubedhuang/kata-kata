import { json, type RequestHandler } from '@sveltejs/kit';
import parser from 'papaparse';

import type { Definition, Source, Word } from '$lib/types';

const SHEET =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-xdwfzK86O86JlDqrKUNWZCUuMq5fdu5os7EB79VfY9NiTY6Q5_a_uaJ07YIOFeaulTmYfhz77Nnt/pub?gid=316018093&single=true&output=csv';

const keys = [
	['word'],
	['wordi'],
	['definitions', 'partOfSpeech'],
	['definitions', 'meaning'],
	['source', 'creator'],
	['source', 'language'],
	['source', 'word'],
	['source', 'transliteration'],
	['source', 'definition']
] as const;

function normalizeString(str: string) {
	return str.trim().normalize().replace(/\s+/g, ' ');
}

function parseWords(csv: string) {
	const rawData = parser.parse(csv).data as string[][];

	rawData.shift();
	rawData.shift();
	rawData.shift();
	rawData.shift();

	const words = [];
	let currentWord = '';

	for (const row of rawData) {
		row.shift();

		if (row[0]) {
			currentWord = normalizeString(row[0]);

			const word = {
				word: currentWord
			} as Word;

			for (const [i, cell] of row.entries()) {
				if (!cell) continue;

				const value = normalizeString(cell);

				const first = keys[i][0];

				if (first === 'word' || first === 'wordi') {
					word[first] = value;
				} else {
					const [key, subkey] = keys[i] as Exclude<
						(typeof keys)[number],
						readonly ['word'] | readonly ['wordi']
					>;

					if (key === 'definitions') {
						word.definitions ??= [];

						if (!word.definitions.length) {
							word.definitions.push({} as Definition);
						}

						word.definitions[0][subkey] = value;
					} else {
						word.source ??= {} as Source;

						word.source[subkey] = value;
					}
				}
			}

			words.push(word);
		} else {
			row.shift();

			const word = words.at(-1)!;

			word.definitions.push({
				partOfSpeech: normalizeString(row[0]),
				meaning: normalizeString(row[1])
			});
		}
	}

	return words;
}

export const GET = (async ({ fetch, setHeaders }) => {
	const words = await fetch(SHEET)
		.then(res => res.text())
		.then(parseWords);

	setHeaders({
		'Cache-Control': 'max-age=300, public'
	});

	return json(words);
}) satisfies RequestHandler;
