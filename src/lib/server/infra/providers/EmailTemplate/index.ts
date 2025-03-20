import type { IEmailTemplate, TemplateList } from '$lib/server/app/providers/EmailTemplate';
import type { ITokenOutDTO } from '$lib/server/domain/dtos/Token/TokenOut';
import type { IUserInDTO } from '$lib/server/domain/dtos/User/UserIn';

import dayjs from 'dayjs';
import mjml2html from 'mjml';
import Mustache from 'mustache';
import fs from 'node:fs/promises';
import path from 'node:path';

import { HOST } from '$env/static/private';

export class EmailTemplate implements IEmailTemplate {
	async accountRecovery(user: IUserInDTO, token: ITokenOutDTO): Promise<string> {
		const recoveryLink = `${HOST}/app/account-recovery/step-2?token=${token.token}`;

		const expiredAt = dayjs(token.expiredAt).format('D MMMM YYYY, HH.mm UTCZ');

		return await this.renderEmail('AccountRecovery', {
			recoveryLink,
			expiredAt,
			fullname: user.fullname,
			host: HOST,
		});
	}

	private async renderEmail(templateName: TemplateList, parameters: any): Promise<string> {
		// ? get template from mjml file
		const templatePath = path.resolve(import.meta.dirname, `./templates/${templateName}.mjml`);
		const rawTemplate = await fs.readFile(templatePath, 'utf-8');

		// ? fill parameter with value
		const signedTemplate = Mustache.render(rawTemplate, parameters);

		// ? render with mjml and return it
		return mjml2html(signedTemplate).html;
	}
}
