<script lang="ts">
	export let items: [string, string[]][];
</script>

<table class="w-full">
	{#each items as [title, words]}
		<tr class="border-b last:border-0">
			<th class="py-1 font-bold text-left align-text-top">
				{title}
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
