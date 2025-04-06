import type { ICreateLabelDTO } from '$lib/server/domain/dtos/Label/CreateLabel';
import type { ILabelInDTO } from '$lib/server/domain/dtos/Label/LabelIn';
import type { IUpdateLabelDTO } from '$lib/server/domain/dtos/Label/UpdateLabel';

export interface ILabelFilter {
	label?: string[];
	labelId?: string[];
	userId?: string;
}

export interface ILabelRepository {
	create(newLabel: ICreateLabelDTO): Promise<ILabelInDTO>;
	update(noteId: string, label: IUpdateLabelDTO): Promise<ILabelInDTO | null>;
	finds(filter: ILabelFilter): Promise<ILabelInDTO[]>;
	delete(labelId: string): Promise<void>;
}
