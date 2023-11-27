<script lang="ts">
	import Creators from './Creators.svelte';
	import Languages from './Languages.svelte';
	import PartsOfSpeech from './PartsOfSpeech.svelte';
	import StartingLetters from './StartingLetters.svelte';
	import Syllables from './Syllables.svelte';

	export let data;
</script>

<svelte:head>
	<title>aka nemune</title>
</svelte:head>

<h1 class="mt-12 font-bold text-4xl">aka nemune</h1>

<p class="mt-4">
	<a href="/" class="inline-block px-2 py-1 clickable">eta</a>
</p>

<Syllables words={data.words} />
<PartsOfSpeech words={data.words} />
<StartingLetters words={data.words} />
<Creators words={data.words} />
<Languages words={data.words} />
