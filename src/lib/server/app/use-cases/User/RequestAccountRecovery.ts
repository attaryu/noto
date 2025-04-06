export interface IRequestAccountRecovery {
	execute(email: string): Promise<boolean>;
}
