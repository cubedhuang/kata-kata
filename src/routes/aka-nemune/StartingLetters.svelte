<script lang="ts">
	import type { Word } from '$lib/types';

	import Separator from '$lib/components/Separator.svelte';
	import Table from './Table.svelte';

	export let words: Word[];

	$: startingLetterGroups = words.reduce((acc, word) => {
		const letter = word.word[0];

		if (acc.has(letter)) {
			acc.get(letter)!.push(word.word);
		} else {
			acc.set(letter, [word.word]);
		}

		return acc;
	}, new Map<string, string[]>());
</script>

<Separator>starting letters</Separator>
<Table items={startingLetterGroups} />
