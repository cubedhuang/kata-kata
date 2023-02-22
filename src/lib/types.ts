export interface Definition {
	partOfSpeech: string;
	meaning: string;
}

export interface Source {
	creator: string;
	language: string;
	word: string;
	transliteration: string;
	definition: string;
}

export interface Word {
	word: string;

	definitions: Definition[];
	source: Source;
}
