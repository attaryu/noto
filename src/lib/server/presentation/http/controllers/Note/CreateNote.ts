import type { ICreateNote } from '$lib/server/app/use-cases/Note/CreateNote';
import type { IResponseDTO } from '$lib/server/domain/dtos/Response';
import type { IHttpRequest } from '$lib/server/presentation/helpers/interfaces/HttpRequest';
import type { IController } from '../Controller';

export class CreateNoteController implements IController {
	constructor(private readonly createNoteCase: ICreateNote) {}

	async handler(request: IHttpRequest): Promise<IResponseDTO> {
		const result = await this.createNoteCase.execute({
			...request.body,
			userId: request.locals!.tokenPayload!.id,
		});

		return {
			statusCode: 201,
			success: true,
			payload: {
				note: result,
			},
		};
	}
}
