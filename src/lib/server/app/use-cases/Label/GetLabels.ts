import type { ILabelOutDTO } from '$lib/server/domain/dtos/Label/LabelOut';

export interface IGetLabels {
  execute(userId: string): Promise<ILabelOutDTO[]>;
}
