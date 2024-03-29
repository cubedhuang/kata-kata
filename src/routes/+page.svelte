<script lang="ts">
	import { distance } from 'fastest-levenshtein';
	import { fly } from 'svelte/transition';

	import { WordForm, form, getDisplayWord } from '$lib/stores';
	import { type Word, wordForms } from '$lib/util';

	import WordDetails from '$lib/components/WordDetails.svelte';

	export let data;

	let detailed = false;

	$: words = data.words;

	const normalize = (str: string) =>
		str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim();

	let search = '';
	$: fixedSearch = normalize(search);

	$: scoreMatch = (str: string | undefined) => {
		if (!str) return 0;

		const normalized = normalize(str);

		const includes = normalized.includes(fixedSearch);

		if (includes) {
			return str === fixedSearch ? 10 : 1;
		}

		const distanceScore =
			distance(normalized, fixedSearch) / (normalized.length + 1);

		if (distanceScore > 0.5) return 0;

		return 1 - distanceScore;
	};

	$: scoreWord = (word: Word) => {
		return (
			wordForms(word).reduce((acc, form) => acc + scoreMatch(form), 0) * 100 +
			word.definitions.reduce((acc, def) => acc + scoreMatch(def.meaning), 0) *
				50 +
			scoreMatch(word.source.definition) * 20 +
			scoreMatch(word.source.word) * 20 +
			scoreMatch(word.source.transliteration) * 20 +
			scoreMatch(word.source.language) * 20 +
			scoreMatch(word.source.creator) * 20
		);
	};

	$: filteredWords = !fixedSearch
		? words
		: words
				.map(word => [word, scoreWord(word)] as [Word, number])
				.filter(([_, score]) => score > 19)
				.sort(([, a], [, b]) => b - a)
				.map(([word]) => word);

	let selectedWord: Word | null = null;
</script>

<svelte:head>
	<title>kata nemune</title>
</svelte:head>

<h1 class="mt-12 font-bold text-4xl">kata nemune</h1>

<div class="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1">
	<div class="flex flex-wrap gap-2">
		<button class="px-2 py-1 clickable" on:click={() => (detailed = !detailed)}>
			{detailed
				? $form === WordForm.Via
					? 'visala'
					: 'wisala'
				: $form === WordForm.Via
				? 'vi'
				: 'wi'}
		</button>

		<select class="px-2 py-1 interactable cursor-pointer" bind:value={$form}>
			<option value={WordForm.Wija}>asera Wija</option>
			<option value={WordForm.Wia}>asera Wia</option>
			<option value={WordForm.Via}>asera Via</option>
		</select>
	</div>

	<div class="flex flex-wrap gap-2">
		<a href="/aka-nemune" class="ml-auto px-2 py-1 clickable">aka</a>
		<a
			href="https://github.com/cubedhuang/kata-kata"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 px-2 py-1 clickable"
		>
			kose texa
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
					clip-rule="evenodd"
				/>
				<path
					fill-rule="evenodd"
					d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>
	</div>
</div>

<p class="mt-2 faded">
	{filteredWords.length} / {words.length}
</p>

<p class="mt-1">
	<input
		type="text"
		placeholder="search..."
		bind:value={search}
		class="w-96 max-w-full px-3 py-2 interactable"
	/>
</p>

<div class="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
	{#each filteredWords as word (word.word)}
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
			<h2 class="font-bold text-xl" class:-mb-2={detailed}>
				{$getDisplayWord(word)}
			</h2>

			<WordDetails {word} {detailed} />
		</button>
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
					<h2 class="mr-auto font-bold text-2xl">
						{$getDisplayWord(selectedWord)}
					</h2>

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

				<WordDetails word={selectedWord} detailed />
			</div>
		{/key}
	</div>
{/if}
