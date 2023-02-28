import { derived, writable } from 'svelte/store';

import type { Word } from './types';

export const ji = writable(true);

export const getDisplayWord = derived(
	[ji],
	([$ji]) =>
		(word: Word) =>
			$ji ? word.word : word.wordi
);
