export default interface Session {
	token: string;
	userId: number;
	expiredOn: Date;
}
