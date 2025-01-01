export class NoteNotFoundError extends Error {
	constructor(id: string) {
    super(`Note with id ${id} is not found`);		
		this.name = 'NoteNotFoundError';
	}
}
