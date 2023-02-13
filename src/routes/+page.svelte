<script lang="ts">
	import { fly } from 'svelte/transition';

	import type { Word } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	enum SearchMode {
		Word = 'kata',
		Meaning = 'definition',
		PartOfSpeech = 'part of speech',
		Language = 'language'
	}

	const keys: Record<SearchMode, keyof Word> = {
		[SearchMode.Word]: 'word',
		[SearchMode.Meaning]: 'meaning',
		[SearchMode.PartOfSpeech]: 'partOfSpeech',
		[SearchMode.Language]: 'sourceLanguage'
	};

	$: words = data.words;

	let searchMode = SearchMode.Word;
	let search = '';
	let detailed = false;

	$: filteredWords = words.filter(word => {
		if (search === '') return true;

		const key = keys[searchMode];

		return word[key]!.toLowerCase().includes(search.toLowerCase());
	});

	let selectedWord: Word | null = null;
</script>

<h1 class="mt-12 font-bold text-4xl">kata kata</h1>

<p class="mt-4">
	<select bind:value={searchMode} class="px-2 py-1 interactable cursor-pointer">
		{#each Object.values(SearchMode) as mode}
			<option value={mode}>{mode}</option>
		{/each}
	</select>

	<button class="px-2 py-1 clickable" on:click={() => (detailed = !detailed)}>
		{detailed ? 'wi' : 'sana'}
	</button>
</p>

<p class="mt-2 faded">
	{filteredWords.length} / {words.length}
</p>

<p class="mt-1">
	<input
		type="text"
		placeholder="{searchMode}..."
		bind:value={search}
		class="w-96 max-w-full px-3 py-2 interactable"
	/>
</p>

<div class="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
	{#each filteredWords as word}
		<button
			class="flex flex-col text-left p-4 clickable"
			on:click={() => {
				if (selectedWord === word) {
					selectedWord = null;
				} else {
					selectedWord = word;
				}
			}}
		>
			<h2 class="font-bold text-xl">{word.word}</h2>
			<p class="faded">{word.partOfSpeech}</p>
			<p>{word.meaning}</p>

			{#if detailed}
				<p class="mt-2">
					{word.sourceLanguage}
					{#if word.sourceWord}
						{word.sourceWord}
					{/if}
					{#if word.sourceTransliteration}
						{word.sourceTransliteration}
					{/if}
					{#if word.sourceDefinition}
						'{word.sourceDefinition}'
					{/if}
				</p>
				<p class="mt-2 italic">{word.creator}</p>
			{/if}
		</button>
	{/each}
</div>

{#if selectedWord}
	{#key selectedWord.word}
		<div
			transition:fly={{ y: 24, duration: 300 }}
			class="fixed p-6 bottom-0 left-0 right-0 border-t border-gray-200
				sm:w-96 sm:left-auto sm:bottom-4 sm:right-4 sm:box shadow-lg
				bg-white"
		>
			<h2 class="font-bold text-2xl">{selectedWord.word}</h2>
			<p class="faded">{selectedWord.partOfSpeech}</p>
			<p>{selectedWord.meaning}</p>

			<p class="mt-2">
				{selectedWord.sourceLanguage}
				{#if selectedWord.sourceWord}
					{selectedWord.sourceWord}
				{/if}
				{#if selectedWord.sourceTransliteration}
					{selectedWord.sourceTransliteration}
				{/if}
				{#if selectedWord.sourceDefinition}
					'{selectedWord.sourceDefinition}'
				{/if}
			</p>
			<p class="mt-2 italic">{selectedWord.creator}</p>

			<button
				class="mt-4 px-2 py-1 clickable"
				on:click={() => (selectedWord = null)}
			>
				Close
			</button>
		</div>
	{/key}
{/if}
