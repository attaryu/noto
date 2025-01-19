import type { ICreateNoteDTO } from '../dtos/Note/CreateNote';
import type { IUpdateNoteDTO } from '../dtos/Note/UpdateNote';

import { NoteError } from '../errors/Note';
import { validateArray, validatePrimitive } from '../helper/validateProperty';

export interface NoteInterface {
	id?: string;
	iv: string;
	userId: string;
	labels: string[];
	indexedWords: string[];
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
	private _indexedWords: string[];
	private _content: string;
	private _archived: boolean;
	private _pinned: boolean;
	private readonly _deletedAt: Date | null;

	constructor(props: NoteInterface) {
		this._id = props.id;
		this._iv = props.iv;
		this._userId = props.userId;
		this._indexedWords = props.indexedWords;
		this._labels = props.labels;
		this._content = props.content;
		this._archived = props.archived;
		this._pinned = props.pinned;
		this._deletedAt = props.deletedAt;
	}

	static create(props: ICreateNoteDTO): NoteEntity {
		validatePrimitive(props.iv, 'string', new NoteError.Entity('iv'));
		validatePrimitive(props.content, 'string', new NoteError.Entity('content'));
		validatePrimitive(props.userId, 'string', new NoteError.Entity('userId'));

		validateArray(props.labels, {
			itemRequired: true,
			errorInstance: new NoteError.Entity('labels'),
			itemType: 'string',
		});

		validateArray(props.indexedWords, {
			itemRequired: true,
			errorInstance: new NoteError.Entity('indexedWords'),
			itemType: 'string',
		});

		return new NoteEntity({ ...props, archived: false, pinned: false, deletedAt: null });
	}

	public update(props: IUpdateNoteDTO): IUpdateNoteDTO {
		// ? If one of content or indexedWords is defined, then one of them cannot be undefined
		if ((props.content === undefined) !== (props.indexedWords === undefined)) {
			throw new NoteError.Content();
		}

		if (props.archived !== undefined) {
			validatePrimitive(props.archived, 'boolean', new NoteError.Entity('archived'));

			// ? If the notes are archived, pin automatically removed
			this._pinned = false;
			this._archived = props.archived;
		}

		if (props.content !== undefined) {
			validatePrimitive(props.content, 'string', new NoteError.Entity('content'));
			this._content = props.content;
		}

		if (props.pinned !== undefined) {
			validatePrimitive(props.pinned, 'boolean', new NoteError.Entity('pinned'));

			if (this._archived) {
				throw new NoteError.Pin();
			}

			this._pinned = props.pinned;
		}

		if (props.indexedWords !== undefined) {
			validateArray(props.indexedWords, {
				itemType: 'string',
				itemRequired: true,
				errorInstance: new NoteError.Entity('indexedWords'),
			});

			this._indexedWords = props.indexedWords;
		}

		if (props.labels !== undefined) {
			validateArray(props.labels, {
				itemType: 'string',
				errorInstance: new NoteError.Entity('labels'),
			});

			this._labels = props.labels;
		}

		return {
			archived: this._archived,
			pinned: this._pinned,
			content: this._content,
			indexedWords: this._indexedWords,
			labels: this._labels,
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

	get indexedWords() {
		return this._indexedWords;
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
}
