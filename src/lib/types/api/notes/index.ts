import type { IResponseAPI } from '$lib/types/response';

export interface INote {
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
	index: string[];
	labels: string[];
	content: string;
}

export type INoteUpdate = Partial<Omit<INote, 'id' | 'createdAt' | 'updatedAt'>>;

export type INoteResponse = IResponseAPI<{ note: INote }>;

export type INotesResponse = IResponseAPI<{ notes: INote[] }>;
