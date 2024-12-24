export interface IGetRecoveryKeyDTO {
	recoveryKey: string;
	token: string;
}

export interface IGetRecoveryKey {
	execute(token: string, keyOrder: string): Promise<IGetRecoveryKeyDTO>;
}
