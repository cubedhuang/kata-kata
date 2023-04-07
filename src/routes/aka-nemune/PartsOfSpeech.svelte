<script lang="ts">
	import type { Word } from '$lib/util';

	import Separator from '$lib/components/Separator.svelte';
	import Table from './Table.svelte';

	export let words: Word[];

	$: posGroups = words.reduce((acc, word) => {
		const partsOfSpeech = word.definitions.map(d => d.partOfSpeech);

		for (const pos of partsOfSpeech) {
			if (acc.has(pos)) {
				acc.get(pos)!.push(word.word);
			} else {
				acc.set(pos, [word.word]);
			}
		}

		return acc;
	}, new Map<string, string[]>());
</script>

<Separator>parts of speech</Separator>
<Table items={posGroups} />
