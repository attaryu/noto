export interface IGetRecoveryKeyDTO {
	recoveryKey: {
		code: string;
		value: string;
		salt: string;
		iv: string;
	};
	token: {
		value: string;
		expiredAt: Date;
	};
}

export interface IGetRecoveryKey {
	execute(token: string, keyOrder: string): Promise<IGetRecoveryKeyDTO>;
}
