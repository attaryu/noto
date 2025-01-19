export interface ICreateNoteDTO {
	iv: string;
	userId: string;
	labels: string[];
	indexedWords: string[];
	content: string;
}
