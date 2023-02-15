<script lang="ts">
	import type { Word } from '$lib/types';

	import Separator from '$lib/components/Separator.svelte';
	import Table from './Table.svelte';

	export let words: Word[];

	$: languageGroups = words.reduce((acc, word) => {
		const name = word.sourceLanguage;

		if (acc.has(name)) {
			acc.get(name)!.push(word.word);
		} else {
			acc.set(name, [word.word]);
		}

		return acc;
	}, new Map<string, string[]>());

	$: sortedLanguages = [...languageGroups.entries()].sort(([a], [b]) =>
		a.localeCompare(b)
	);
</script>

<Separator>languages</Separator>
<Table items={sortedLanguages} />
