<script lang="ts">
	import type { Word } from '$lib/types';
	import Separator from '$lib/components/Separator.svelte';

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

	$: startingLetters = [...startingLetterGroups.entries()].sort(([a], [b]) =>
		a.localeCompare(b)
	);
</script>

<Separator>starting letters</Separator>

<table class="w-full">
	{#each startingLetters as [letter, words]}
		<tr class="border-b last:border-0">
			<th class="py-1 font-bold text-left align-text-top">
				{letter}
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
