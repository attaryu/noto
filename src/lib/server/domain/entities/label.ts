import type { ICreateLabelDTO } from '../dtos/Label/CreateLabel';
import type { IUpdateLabelDTO } from '../dtos/Label/UpdateLabel';

import { Validation } from '../helper/validation';

export interface LabelInterface {
	id: string;
	name: string;
	userId: string;
	used: number;
}

export class LabelEntity {
	private readonly _id: LabelInterface['id'];
	private readonly _name: LabelInterface['name'];
	private readonly _userId: LabelInterface['userId'];
	private _used: LabelInterface['used'];

	public static create(props: ICreateLabelDTO): LabelEntity {
		Validation.object(props, {
			type: 'object',
			required: true,
			properties: {
				name: { type: 'string', required: true },
				userId: { type: 'string', required: true },
			},
		});

		return new LabelEntity({ ...props, id: '', used: 1 });
	}

	public update(props: IUpdateLabelDTO) {
		Validation.object(props, {
			type: 'object',
			required: true,
			properties: {
				used: { type: 'number', required: true },
			},
		});

		this._used = props.used;
	}

	public toObject(): LabelInterface {
		return {
			id: this._id,
			name: this._name,
			userId: this._userId,
			used: this._used,
		};
	}

	public increaseUsage() {
		this._used++;
	}

	public decreaseUsage() {
		this._used--;
	}

	get isUnused() {
		return this._used <= 0;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get userId() {
		return this._userId;
	}

	get used() {
		return this._used;
	}

	constructor(props: LabelInterface) {
		this._id = props.id;
		this._name = props.name;
		this._used = props.used;
		this._userId = props.userId;
	}
}
