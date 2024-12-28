import type { ITokenManager } from '$lib/server/app/providers/TokenManager';
import type { ICreateNote } from '$lib/server/app/use-cases/Note/CreateNote';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/HttpRequest';
import type { IController } from '../Controller';

export class CreateNoteController implements IController {
	constructor(
		private readonly createNoteCase: ICreateNote,
		private readonly tokenManager: ITokenManager,
	) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const { body } = request;

		if (!(body && Object.keys(body).length)) {
			return {
				statusCode: 400,
				success: false,
				error: { message: 'request body cannot be empty!' },
			};
		}

		const token = request.cookies!.get('AUTH_TOKEN')!;
		const tokenPayload = await this.tokenManager.verify(token);

		const result = await this.createNoteCase.execute({ ...body, userId: tokenPayload.id });

		return {
			statusCode: 201,
			success: true,
			payload: {
				note: result,
			},
		};
	}
}
