import { derived, writable } from 'svelte/store';

import type { Word } from './util';

export enum WordForm {
	Wija,
	Wia,
	Via
}

export const form = writable<WordForm>(WordForm.Wija);

export const getDisplayWord = derived(
	[form],
	([$form]) =>
		(word: Word) =>
			$form === WordForm.Wija
				? word.word
				: $form === WordForm.Wia
				? word.wordi
				: word.wordi.replaceAll('w', 'v')
);
