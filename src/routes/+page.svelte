<script lang="ts">
	import { fly } from 'svelte/transition';

	import { createCategories } from '$lib/createCategories';
	import type { Word } from '$lib/types';
	import type { PageData } from './$types';
	import Separator from '$lib/components/Separator.svelte';

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

	$: filteredCategories = createCategories(filteredWords);

	let selectedWord: Word | null = null;
</script>

<svelte:head>
	<title>kata nemune</title>
</svelte:head>

<h1 class="mt-12 font-bold text-4xl">kata nemune</h1>

<p class="mt-4 flex gap-2">
	<select bind:value={searchMode} class="px-2 py-1 interactable cursor-pointer">
		{#each Object.values(SearchMode) as mode}
			<option value={mode}>{mode}</option>
		{/each}
	</select>

	<button class="px-2 py-1 clickable" on:click={() => (detailed = !detailed)}>
		{detailed ? 'wi' : 'piki'}
	</button>

	<a href="/aka-nemune" class="ml-auto px-2 py-1 clickable">aka</a>
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

<div class="mt-4">
	{#each [...filteredCategories.entries()] as [name, words] (name)}
		<Separator>
			{name}
		</Separator>

		<div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
			{#each words as word (word.word)}
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
	{/each}
</div>

{#if selectedWord}
	<div
		transition:fly|local={{ y: 24, duration: 300 }}
		class="z-20 fixed bottom-0 right-0 w-full"
	>
		{#key selectedWord.word}
			<div
				transition:fly|local={{ y: 24, duration: 300 }}
				class="absolute p-6 bottom-0 left-0 right-0 border-t border-gray-200
					sm:w-96 sm:left-auto sm:bottom-4 sm:right-4 sm:box shadow-lg
					bg-white"
			>
				<div class="flex">
					<h2 class="mr-auto font-bold text-2xl">{selectedWord.word}</h2>

					<a href="/{selectedWord.word}" class="mr-2 p-1 clickable">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
							/>
						</svg>
					</a>

					<button class="p-1 clickable" on:click={() => (selectedWord = null)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
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
			</div>
		{/key}
	</div>
{/if}
