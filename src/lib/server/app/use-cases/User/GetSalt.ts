export interface IGetSalt {
	execute(email: string): Promise<string>;
}
