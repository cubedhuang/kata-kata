<script lang="ts">
	import { page } from '$app/stores';
	import WordDetails from '$lib/components/WordDetails.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: word = data.word;

	$: meanings = word.definitions
		.map(d => `${d.partOfSpeech} · ${d.meaning}`)
		.join('\n\n');
</script>

<svelte:head>
	<title>{$page.params.kata}</title>
	<meta name="description" content={meanings} />

	<meta property="og:title" content={$page.params.kata} />
	<meta property="og:description" content={meanings} />
</svelte:head>

<p class="mt-8">
	<a href="/" class="inline-block px-2 py-1 clickable">eta</a>
</p>

<h1 class="mt-8 font-bold text-4xl">{$page.params.kata}</h1>

<WordDetails {word} detailed />
