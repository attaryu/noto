export interface IDeleteSession {
  execute(token: string): Promise<void>;
}