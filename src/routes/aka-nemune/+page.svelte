<script lang="ts">
	import type { PageData } from './$types';

	import Creators from './Creators.svelte';
	import Languages from './Languages.svelte';
	import PartsOfSpeech from './PartsOfSpeech.svelte';
	import StartingLetters from './StartingLetters.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>aka nemune</title>
</svelte:head>

<h1 class="mt-12 font-bold text-4xl">aka nemune</h1>

<p class="mt-4">
	<a href="/" class="inline-block px-2 py-1 clickable">eta</a>
</p>

<PartsOfSpeech words={data.words} />
<StartingLetters words={data.words} />
<Creators words={data.words} />
<Languages words={data.words} />
