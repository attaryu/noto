import type { ILabelRepository } from '$lib/server/app/repositories/Label';
import type { ILabelOutDTO } from '$lib/server/domain/dtos/Label/LabelOut';
import type { IGetLabels } from '../GetLabels';

export class GetLabels implements IGetLabels {
	constructor(private readonly labelRepository: ILabelRepository) {}

	async execute(userId: string): Promise<ILabelOutDTO[]> {
		const labelFromDatabase = await this.labelRepository.finds({ userId });
		return labelFromDatabase.map(({ userId, used, ...label }) => label);
	}
}
