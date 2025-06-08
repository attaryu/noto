export interface INoteOutDTO {
	id: string;
	iv: string;
	labels: string[];
	index: string[];
	content: string;
	archived: boolean;
	pinned: boolean;
	updatedAt?: string | Date;
	createdAt?: string | Date;
}