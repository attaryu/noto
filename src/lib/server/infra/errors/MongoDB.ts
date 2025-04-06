export namespace MongoDBError {
  export class InvalidId extends Error {
    constructor() {
      super('Invalid id.');
      this.name = 'MongoDBInvlidIdError';
    }
  }
}