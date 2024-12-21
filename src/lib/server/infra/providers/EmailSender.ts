import type { EmailPayload, IEmailSender } from '$lib/server/app/providers/EmailSender';

import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER } from '$env/static/private';
import { createTransport } from 'nodemailer';

export class EmailSender implements IEmailSender {
	async send(payload: EmailPayload): Promise<boolean> {
		await createTransport({
			host: EMAIL_HOST,
			port: parseInt(EMAIL_PORT),
			secure: false,
			auth: {
				user: EMAIL_USER,
				pass: EMAIL_PASSWORD,
			},
		}).sendMail({
			from: `"Noto" <noto@gmail.com>`,
			to: payload.to,
			subject: payload.subject,
			html: payload.htmlContent,
		});

		return true;
	}
}
