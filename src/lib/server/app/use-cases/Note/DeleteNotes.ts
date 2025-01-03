export interface IDeleteNotes {
	execute(noteId: string[], userId: string): Promise<void>;
}
