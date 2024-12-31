export interface ICreateNoteDTO {
	userId: string;
	labels: string[];
	indexedWords: string[];
	content: string;
}
