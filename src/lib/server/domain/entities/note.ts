import type { ICreateNoteDTO } from '../dtos/Note/CreateNote';
import type { IUpdateNoteDTO } from '../dtos/Note/UpdateNote';

import { NoteError } from '../errors/Note';
import { Validation } from '../helper/validation';

export interface NoteInterface {
	id?: string;
	iv: string;
	userId: string;
	labels: string[];
	index: string[];
	content: string;
	archived: boolean;
	pinned: boolean;
	deletedAt: Date | null;
}

export class NoteEntity {
	private readonly _id?: string;
	private readonly _iv: string;
	private readonly _userId: string;
	private _labels: string[];
	private _index: string[];
	private _content: string;
	private _archived: boolean;
	private _pinned: boolean;
	private readonly _deletedAt: Date | null;

	static create(props: ICreateNoteDTO): NoteEntity {
		Validation.object(props, {
			type: 'object',
			required: true,
			properties: {
				iv: { type: 'string', required: true },
				userId: { type: 'string', required: true },
				labels: { type: 'array', items: { type: 'string' }, required: true },
				index: { type: 'array', items: { type: 'string', required: true }, required: true },
				content: { type: 'string', required: true },
			},
		});

		return new NoteEntity({ ...props, archived: false, pinned: false, deletedAt: null });
	}

	public update(props: IUpdateNoteDTO): void {
		Validation.object(props, {
			type: 'object',
			properties: {
				archived: { type: 'boolean' },
				pinned: { type: 'boolean' },
				content: { type: 'string' },
				index: { type: 'array', items: { type: 'string', required: true } },
				labels: { type: 'array', items: { type: 'string' } },
			},
		});

		// ? If one of content or index is defined, then one of them cannot be undefined
		if ((props.content === undefined) !== (props.index === undefined)) {
			throw new NoteError.Content();
		}

		if (props.archived !== undefined) {
			this._archived = props.archived;

			// ? If the notes are archived, pin automatically removed
			this._pinned = false;
		}

		if (props.content !== undefined) {
			this._content = props.content;
		}

		if (props.pinned !== undefined) {
			if (this._archived) {
				throw new NoteError.Pin();
			}

			this._pinned = props.pinned;
		}

		if (props.index !== undefined) {
			this._index = props.index;
		}

		if (props.labels !== undefined) {
			this._labels = props.labels;
		}
	}

	public toObject(): NoteInterface {
		return {
			id: this._id,
			iv: this._iv,
			userId: this._userId,
			labels: this._labels,
			index: this._index,
			content: this._content,
			archived: this._archived,
			pinned: this._pinned,
			deletedAt: this._deletedAt,
		};
	}

	public isOwnedBy(userId: string) {
		return this._userId === userId;
	}

	get isDeleted() {
		return this._deletedAt !== null;
	}

	get id() {
		return this._id;
	}

	get iv() {
		return this._iv;
	}

	get userId() {
		return this._userId;
	}

	get index() {
		return this._index;
	}

	get labels() {
		return this._labels;
	}

	get content() {
		return this._content;
	}

	get archived() {
		return this._archived;
	}

	get pinned() {
		return this._pinned;
	}

	get deletedAt() {
		return this._deletedAt;
	}

	constructor(props: NoteInterface) {
		this._id = props.id;
		this._iv = props.iv;
		this._userId = props.userId;
		this._index = props.index;
		this._labels = props.labels;
		this._content = props.content;
		this._archived = props.archived;
		this._pinned = props.pinned;
		this._deletedAt = props.deletedAt;
	}
}
