export function getWord(words: Word[], kata: string) {
	return words.find(word => wordForms(word).includes(kata));
}

export function wordForms(word: Word) {
	return [word.word, word.wordi, word.wordi.replaceAll('w', 'v')];
}

export interface Word {
	word: string;
	wordi: string;

	definitions: Definition[];
	source: Source;
}

export interface Definition {
	partOfSpeech: string;
	meaning: string;
}

export interface Source {
	creator: string;
	language: string;
	word?: string;
	transliteration?: string;
	definition?: string;
}
