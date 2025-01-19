export interface INoteOutDTO {
	id: string;
	iv?: string;
	userId?: string;
	labels: string[];
	indexedWords: string[];
	content: string;
	archived: boolean;
	pinned: boolean;
	updatedAt?: Date;
	createdAt?: Date;
	deletedAt?: Date | null;
}