# kata nemune

This is an interactive, auto-updating dictionary from the constructed language [_nemune_](https://docs.google.com/document/d/1opPOAFG2INI5E8x38i97f8RP-ihJgho3CxhknMhaSVc/edit?usp=sharing). I blantantly stole most of the design from my other project, [nimi.li](https://nimi.li).

You can use links like https://kata.nimi.li/nemune to link to a specific word, and these will embed in Discord or any other environment that supports Open Graph tags.

## kose

This fetches data from the _kata nemune_ Google Sheet to expose the list of words with an API at https://kata.nimi.li/words, which returns a JSON object:

```json
[
	{
		"word": "te",
		"definitions": [
			{
				"partOfSpeech": "particle",
				"meaning": "(context clause: informs the following clause)"
			}
		],
		"source": {
			"creator": "kose Powa",
			"language": "∅"
		}
	},
	{
		"word": "akani",
		"definitions": [
			{
				"partOfSpeech": "adjective",
				"meaning": "a myriad in number, a multitude in number; common, pervasive"
			},
			{
				"partOfSpeech": "verb",
				"meaning": "inundate, overwhelm"
			}
		],
		"source": {
			"creator": "kose Powa",
			"language": "Gujarati",
			"word": "અગણિત",
			"transliteration": "agaṇit",
			"definition": "innumerable, countless, immeasurable"
		}
	}
	// kata akane...
]
```

### typescript definitions

```ts
type Data = Word[];

interface Word {
	word: string;

	definitions: Definition[];
	source: Source;
}

interface Definition {
	partOfSpeech: string;
	meaning: string;
}

interface Source {
	creator: string;
	language: string;
	word?: string;
	transliteration?: string;
	definition?: string;
}
```
