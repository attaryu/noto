import type { LabelInterface } from '../entities/label';

export namespace LabelError {
	export class Property extends Error {
		constructor(property: keyof LabelInterface) {
			super(`Property ${property} is not suitable`);
			this.name = 'LabelPropertyError';
		}
	}
}
