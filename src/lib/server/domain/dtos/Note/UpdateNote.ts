export interface IUpdateNoteDTO {
	labels?: string[];
	indexedWords?: string[];
	content?: string;
	archived?: boolean;
	pinned?: boolean;
}
