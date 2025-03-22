import { ValidationError } from '../errors/Validation';

type PrimitiveType = 'string' | 'boolean' | 'number' | 'any';
type Validator<T> = (value: T) => boolean | string;

interface PrimitiveSchema {
	type: PrimitiveType;
	required?: boolean;
	custom?: Validator<any>;
}

interface ArraySchema {
	type: 'array';
	required?: boolean;
	items: Schema;
	custom?: Validator<any[]>;
}

interface ObjectSchema {
	type: 'object';
	required?: boolean;
	properties: Record<string, Schema>;
	custom?: Validator<object>;
}

export type Schema = PrimitiveSchema | ArraySchema | ObjectSchema;

/**
 * Schema validation helper class
 */
export const Validation = new (class {
	/**
	 * useful for validating primitive value data type
	 */
	public primitive(value: unknown, schema: PrimitiveSchema, path: string = 'value') {
		if (!this.isDefined(value)) {
			if (schema.required) {
				throw new ValidationError(`${path} is required`);
			}

			return;
		}

		if (schema.type !== 'any' && typeof value !== schema.type) {
			throw new ValidationError(`${path} is not a ${schema.type}`);
		}

		this.customHandling(value, schema, `${path} is invalid`);
	}

	/**
	 * useful for validating array and the items inside
	 */
	public array(value: unknown[], schema: ArraySchema, path: string = 'value') {
		if (!this.isDefined(value)) {
			if (schema.required) {
				throw new ValidationError(`${path} is required`);
			}

			return;
		}

		if (!Array.isArray(value)) {
			throw new ValidationError(`${path} is not an array`);
		}

		if (schema.items.required && !value.length) {
			throw new ValidationError(`${path} cannot be empty`);
		}

		value.forEach((item, index) => {
			const newPath = `${path}[${index}]`;
			const itemSchema = schema.items;

			if (itemSchema.type === 'object') {
				this.object(item, itemSchema, newPath);
			} else if (itemSchema.type === 'array') {
				this.array(item as any[], itemSchema, newPath);
			} else {
				this.primitive(item, itemSchema, newPath);
			}
		});

		this.customHandling(value, schema, `${path} is invalid array`);
	}

	/**
	 * useful for validating object and the properties inside
	 */
	public object(value: any, schema: ObjectSchema, path: string = 'value') {
		if (!this.isDefined(value)) {
			if (schema.required && Object.keys(value).length) {
				throw new ValidationError(`${path} is required`);
			}

			return;
		}

		for (const key in value) {
			if (!Object.hasOwn(schema.properties, key)) {
				throw new ValidationError(`${path}.${key} is not allowed`);
			}
		}

		for (const key in schema.properties) {
			const newPath = `${path === 'value' ? 'root' : path}.${key}`;
			const propertySchema = schema.properties[key];
			const propertyValue = value[key];

			if (propertySchema.required && !Object.hasOwn(value, key)) {
				throw new ValidationError(`${newPath} is required`);
			}

			if (propertySchema.type === 'array') {
				this.array(propertyValue, propertySchema, newPath);
			} else if (propertySchema.type === 'object') {
				this.object(propertyValue, propertySchema, newPath);
			} else {
				this.primitive(propertyValue, propertySchema, newPath);
			}
		}

		this.customHandling(value, schema, `${path} is invalid object`);
	}

	private isDefined(value: unknown): boolean {
		return value !== undefined && value !== null;
	}

	private customHandling(value: unknown, schema: Schema, defaultMessage: string) {
		if (this.isDefined(value) && schema.custom) {
			const custom = schema.custom(value as any);

			if (typeof custom === 'string') {
				throw new ValidationError(custom);
			} else if (!custom) {
				throw new ValidationError(defaultMessage);
			}
		}
	}
})();
