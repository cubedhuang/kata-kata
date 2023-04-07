<script lang="ts">
	import type { Word } from '$lib/util';

	export let word: Word;
	export let detailed = false;
</script>

{#if !detailed}
	<p class="faded">
		{word.definitions.map(d => d.partOfSpeech).join(' · ')}
	</p>

	<p>{word.definitions.map(d => d.meaning).join('; ')}</p>
{:else}
	{#each word.definitions as definition}
		<p class="mt-2">
			<span class="faded">
				{definition.partOfSpeech}
			</span>

			&middot;

			{definition.meaning}
		</p>
	{/each}

	<p class="mt-2">
		{word.source.language}
		{#if word.source.word}
			{word.source.word}
		{/if}
		{#if word.source.transliteration}
			{word.source.transliteration}
		{/if}
		{#if word.source.definition}
			'{word.source.definition}'
		{/if}
	</p>

	<p class="mt-2 italic">{word.source.creator}</p>
{/if}
