export interface IUpdateNoteDTO {
	labels?: string[];
	index?: string[];
	content?: string;
	archived?: boolean;
	pinned?: boolean;
}
