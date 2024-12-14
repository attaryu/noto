export interface ISignOut {
  execute(token: string): Promise<void>;
}