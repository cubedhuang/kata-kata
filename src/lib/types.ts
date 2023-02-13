export type PartOfSpeech =
	| 'particle'
	| 'semi-particle'
	| 'pronoun'
	| 'content word';

export interface Word {
	word: string;
	partOfSpeech: PartOfSpeech | string;
	meaning: string;
	creator: string;

	sourceLanguage: string;
	sourceWord?: string;
	sourceTransliteration?: string;
	sourceDefinition?: string;
}
