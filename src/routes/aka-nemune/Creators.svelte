<script lang="ts">
	import type { Word } from '$lib/types';

	import Separator from '$lib/components/Separator.svelte';
	import Table from './Table.svelte';

	export let words: Word[];

	$: creatorGroups = words.reduce((acc, word) => {
		const creators = word.creator.split('&').map(c => c.trim());

		for (const creator of creators) {
			if (acc.has(creator)) {
				acc.get(creator)!.push(word.word);
			} else {
				acc.set(creator, [word.word]);
			}
		}

		return acc;
	}, new Map<string, string[]>());

	$: sortedNames = [...creatorGroups.entries()].sort(([a], [b]) =>
		a.localeCompare(b)
	);
</script>

<Separator>creators (some overlap)</Separator>
<Table items={sortedNames} />
