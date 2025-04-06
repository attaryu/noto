import { ObjectId } from 'mongodb';

import { MongoDBError } from '../errors/MongoDB';

export function objectId(id: string) {
	if (!ObjectId.isValid(id)) {
		throw new MongoDBError.InvalidId();
	}

	return new ObjectId(id);
}
