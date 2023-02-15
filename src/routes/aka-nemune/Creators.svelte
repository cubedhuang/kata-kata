<script lang="ts">
	import type { Word } from '$lib/types';
	import Separator from '$lib/components/Separator.svelte';

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

<table class="w-full">
	{#each sortedNames as [name, words]}
		<tr class="border-b last:border-0">
			<th class="w-32 py-1 font-bold text-left align-text-top">
				{name}
			</th>

			<td class="pr-2 py-1 text-right align-text-top faded">
				{words.length}
			</td>

			<td class="pl-2 py-1 border-l">
				<ul class="flex flex-wrap gap-x-2">
					{#each words as word}
						<li>
							<a href="/{word}" class="text-blue-500">
								{word}
							</a>
						</li>
					{/each}
				</ul>
			</td>
		</tr>
	{/each}
</table>
