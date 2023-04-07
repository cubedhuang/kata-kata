<script lang="ts">
	import type { Word } from '$lib/util';

	import Separator from '$lib/components/Separator.svelte';
	import Table from './Table.svelte';

	export let words: Word[];

	$: languageGroups = words.reduce((acc, word) => {
		const name = word.source.language;

		if (acc.has(name)) {
			acc.get(name)!.push(word.word);
		} else {
			acc.set(name, [word.word]);
		}

		return acc;
	}, new Map<string, string[]>());
</script>

<Separator>languages</Separator>
<Table items={languageGroups} />
