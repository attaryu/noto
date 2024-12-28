export interface INoteOutDTO {
	id: string;
	userId?: string;
	labels: string[];
	indexedWords: string[];
	content: string;
	updatedAt?: Date;
	createdAt?: Date;
	deletedAt?: Date | null;
}