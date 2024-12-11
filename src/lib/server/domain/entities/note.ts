export default interface Note {
	id: number;
	userId: number;
	label: string[];
	indexed_words: string[];
	content: string;
	updateAt: Date;
	createAt: Date;
	deleteAt: Date | null;
}
