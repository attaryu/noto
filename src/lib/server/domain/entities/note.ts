import type { ICreateNoteDTO } from '../dtos/Note/CreateNote';

import { NoteEntityError } from '../errors/Note/NoteEntityError';
import { validateArray, validatePrimitive } from '../helper/validateProperty';

export interface NoteInterface {
	id?: string;
	userId: string;
	labels: string[];
	indexedWords: string[];
	content: string;
}

export class NoteEntity {
	private readonly _id?: string;
	private readonly _userId: string;
	private readonly _labels: string[];
	private readonly _indexedWords: string[];
	private readonly _content: string;

	constructor(props: NoteInterface) {
		this._id = props.id;
		this._userId = props.userId;
		this._indexedWords = props.indexedWords;
		this._labels = props.labels;
		this._content = props.content;
	}

	static create(props: ICreateNoteDTO): NoteEntity {
		validatePrimitive(props.content, 'string', new NoteEntityError('content'));
		validatePrimitive(props.userId, 'string', new NoteEntityError('userId'));

		validateArray(props.labels, {
			itemRequired: true,
			errorInstance: new NoteEntityError('labels'),
			itemType: 'string',
		});

		validateArray(props.indexedWords, {
			itemRequired: true,
			errorInstance: new NoteEntityError('indexedWords'),
			itemType: 'string',
		});

		return new NoteEntity(props);
	}

	get id() {
		return this._id;
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
}
