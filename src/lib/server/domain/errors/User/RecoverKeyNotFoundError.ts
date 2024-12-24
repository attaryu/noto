export class RecoveryKeyNotFoundError extends Error {
  constructor(order: string) {
    super(`recovery key with order of ${order} not found`);
    this.name = 'RecoveryKeyNotFoundError';
  }
}
