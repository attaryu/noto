export interface EmailPayload {
	to: string;
	subject: string;
	htmlContent: string;
}

export interface IEmailSender {
	send(payload: EmailPayload): Promise<boolean>;
}
