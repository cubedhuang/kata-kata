import type { Word } from './types';

export function getWords(
	fetch: (
		input: RequestInfo | URL,
		init?: RequestInit | undefined
	) => Promise<Response>
) {
	return fetch('/words').then(res => res.json()) as Promise<Word[]>;
}
