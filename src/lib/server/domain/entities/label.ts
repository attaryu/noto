import type { ICreateLabelDTO } from '../dtos/Label/CreateLabel';

import { LabelError } from '../errors/Label';
import { validatePrimitive } from '../helper/validateProperty';

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

	constructor(props: LabelInterface) {
		this._id = props.id;
		this._name = props.name;
		this._used = props.used;
		this._userId = props.userId;
	}

	public static create(props: ICreateLabelDTO): LabelEntity {
		validatePrimitive(props.name, 'string', new LabelError.Property('name'));
		return new LabelEntity({ ...props, id: '', used: 1 });
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
}
