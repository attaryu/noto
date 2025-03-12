import type { IResponseAPI } from '$lib/types/response';

interface INotes {
	id: string;
	iv: string;
	labels: string[];
	content: string;
	archived: boolean;
	pinned: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface INotePayload {
	iv: string;
	index: string[];
	labels: string[];
	content: string;
}

export type INoteUpdate = Partial<Omit<INotes, 'id' | 'createdAt' | 'updatedAt'>>;

export type INoteResponse = IResponseAPI<{ note: INotes }>;

export type INotesResponse = IResponseAPI<{ notes: INotes[] }>;
