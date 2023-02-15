<script lang="ts">
	import type { Word } from '$lib/types';
	import Separator from '$lib/components/Separator.svelte';

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

<table class="w-full">
	{#each sortedLanguages as [name, words]}
		<tr class="border-b last:border-0">
			<th class="py-1 font-bold text-left align-text-top">
				{name}
			</th>

			<td class="pr-2 py-1 text-right align-text-top faded">
				{words.length}
			</td>

			<td class="pl-2 py-1 border-l align-text-top">
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
