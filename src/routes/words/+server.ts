import { json, type RequestHandler } from '@sveltejs/kit';
import parser from 'papaparse';

import type { Definition, Source, Word } from '$lib/types';

const OLD_SHEET =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-xdwfzK86O86JlDqrKUNWZCUuMq5fdu5os7EB79VfY9NiTY6Q5_a_uaJ07YIOFeaulTmYfhz77Nnt/pub?gid=0&single=true&output=csv';
const SHEET =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-xdwfzK86O86JlDqrKUNWZCUuMq5fdu5os7EB79VfY9NiTY6Q5_a_uaJ07YIOFeaulTmYfhz77Nnt/pub?gid=316018093&single=true&output=csv';

const keys = [
	['word'],
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

function parseOldWords(csv: string) {
	const rawData = parser.parse(csv).data as string[][];

	rawData.shift();
	rawData.shift();
	rawData.shift();

	const words = [];

	for (const row of rawData) {
		row.shift();

		if (!row[0] || !row[1]) continue;

		const word = {} as Word;

		for (const [i, cell] of row.entries()) {
			if (!cell) continue;

			const value = normalizeString(cell);

			if (keys[i][0] === 'word') {
				word.word = value;
			} else {
				const [key, subkey] = keys[i] as Exclude<
					(typeof keys)[number],
					readonly ['word']
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
	}

	return words;
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

		if (row[0] !== currentWord && !row[1]) {
			words.push({
				word: normalizeString(row[0])
			} as Word);
		}

		if (row[0]) {
			currentWord = normalizeString(row[0]);

			const word = {
				word: currentWord
			} as Word;

			for (const [i, cell] of row.entries()) {
				if (!cell) continue;

				const value = normalizeString(cell);

				if (keys[i][0] === 'word') {
					word.word = value;
				} else {
					const [key, subkey] = keys[i] as Exclude<
						(typeof keys)[number],
						readonly ['word']
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
			} as Definition);
		}
	}

	return words;
}

function patchWords(words: Word[], oldWords: Word[]) {
	const oldWordsMap = new Map(oldWords.map(word => [word.word, word]));
	const wordsMap = new Map(words.map(word => [word.word, word]));

	for (const [word, oldWord] of oldWordsMap) {
		if (!wordsMap.has(word)) continue;

		const newWord = wordsMap.get(word)!;

		newWord.definitions ??= oldWord.definitions;
		newWord.source ??= oldWord.source;
	}

	for (const [word, newWord] of wordsMap) {
		if (!newWord.definitions) {
			wordsMap.delete(word);
		}
	}

	return [...wordsMap.values()];
}

export const GET = (async ({ fetch, setHeaders }) => {
	const oldWords = await fetch(OLD_SHEET)
		.then(res => res.text())
		.then(parseOldWords);

	const words = await fetch(SHEET)
		.then(res => res.text())
		.then(parseWords)
		.then(words => patchWords(words, oldWords));

	setHeaders({
		'Cache-Control': 'max-age=60, public'
	});

	return json(words);
}) satisfies RequestHandler;
