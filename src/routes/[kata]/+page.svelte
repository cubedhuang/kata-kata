<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: word = data.word;
</script>

<svelte:head>
	<title>{word.word}</title>
	<meta name="description" content={word.meaning} />

	<meta property="og:title" content={word.word} />
	<meta property="og:description" content={word.meaning} />
</svelte:head>

<p class="mt-8">
	<a href="/" class="inline-block px-2 py-1 clickable">eta</a>
</p>

<h1 class="mt-8 font-bold text-4xl">{word.word}</h1>

<p class="mt-4 faded">{word.partOfSpeech}</p>
<p class="mt-2">{word.meaning}</p>

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
