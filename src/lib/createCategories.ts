import type { Word } from './types';

export function createCategories(words: Word[]) {
	const categories = new Map<string, Word[]>();

	for (const word of words) {
		if (!categories.has(word.category)) {
			categories.set(word.category, []);
		}

		categories.get(word.category)!.push(word);
	}

	return categories;
}
