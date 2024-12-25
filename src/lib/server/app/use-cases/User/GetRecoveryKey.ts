export interface IGetRecoveryKeyDTO {
	recoveryKey: string;
	token: {
		value: string;
		expiredAt: Date;
	};
}

export interface IGetRecoveryKey {
	execute(token: string, keyOrder: string): Promise<IGetRecoveryKeyDTO>;
}
