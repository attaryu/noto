import type { ISignInOutDTO } from '$lib/server/domain/dtos/Session/SignInOut';
import type { ISignInDTO } from '$lib/server/domain/dtos/User/SignInUser';

export interface ISignIn {
	execute(data: ISignInDTO): Promise<ISignInOutDTO>;
}
