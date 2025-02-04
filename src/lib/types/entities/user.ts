export interface IUserResponse {
	id: string;
	fullname: string;
	email: string;
}

export interface ICreateUserInputDTO {
	fullname: string;
	email: string;
	password: string;
}

export interface ICreateUserDTO {
	fullname: string;
	email: string;
	password: {
		value: string;
		salt: string;
	};
	secretKey: {
		value: string;
		iv: string;
	};
	recoveryKeys: Array<{
		code: string;
		value: string;
		salt: string;
		iv: string;
	}>;
}
