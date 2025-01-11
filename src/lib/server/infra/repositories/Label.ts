import type { ILabelFilter, ILabelRepository } from '$lib/server/app/repositories/Label';
import type { ICreateLabelDTO } from '$lib/server/domain/dtos/Label/CreateLabel';
import type { ILabelInDTO } from '$lib/server/domain/dtos/Label/LabelIn';
import type { IUpdateLabelDTO } from '$lib/server/domain/dtos/Label/UpdateLabel';
import type { Collection, MongoClient } from 'mongodb';
import { objectId } from '../helper/objectId';

export type Document = Omit<ILabelInDTO, 'id'>;
// TODO: bug label on note update action
export class LabelRepository implements ILabelRepository {
	private readonly client: MongoClient;
	private readonly database: Collection<Document>;

	constructor(client: MongoClient) {
		this.client = client;
		this.database = client.db('noto').collection<Document>('labels');
	}

	async create(newLabel: ICreateLabelDTO): Promise<ILabelInDTO> {
		const { insertedId } = await this.database.insertOne({
			name: newLabel.name,
			userId: newLabel.userId,
			used: 1,
		});

		const label = await this.finds({
			labelId: [insertedId.toString()],
		});

		return label[0];
	}

	async finds(filter: ILabelFilter): Promise<ILabelInDTO[]> {
		const { label, labelId, userId } = filter;

		const labels = await this.database
			.find(
				{
					...(labelId && { _id: { $in: labelId.map((id) => objectId(id)) } }),
					...(label && { name: { $in: label } }),
					userId,
				},
				{ ignoreUndefined: true },
			)
			.toArray();

		return labels.map(({ _id, ...label }) => ({ ...label, id: _id.toString() }));
	}

	async update(labelId: string, label: IUpdateLabelDTO): Promise<ILabelInDTO | null> {
		const { upsertedId } = await this.database.updateOne(
			{ _id: objectId(labelId) },
			{ $set: { used: label.used } },
		);

		if (upsertedId) {
			const updatedLabel = await this.finds({ labelId: [upsertedId.toString()] });
			return updatedLabel[0];
		}

		return null;
	}

	async delete(labelId: string): Promise<void> {
		await this.database.deleteOne({ _id: objectId(labelId) });
	}
}
