import { ValidationError } from '../errors/Validation';

type PrimitiveType = 'string' | 'boolean' | 'number';
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

export const Validation = new (class {
	/**
	 * useful for validating primitive value data type
	 */
	public primitive(value: unknown, schema: PrimitiveSchema, path: string = 'value') {
		if (schema.required && value === undefined) {
			throw new ValidationError(`${path} is required`);
		}

		if (typeof value !== schema.type) {
			throw new ValidationError(`${path} is not a ${schema.type}`);
		}

		if (schema.custom) {
			const custom = schema.custom(value);

			if (typeof custom === 'string') {
				throw new ValidationError(custom);
			} else if (!custom) {
				throw new ValidationError(`${path} is invalid`);
			}
		}
	}

	/**
	 * useful for validating array and the items inside
	 */
	public array(value: unknown[], schema: ArraySchema, path: string = 'value') {
		if (!Array.isArray(value)) {
			throw new ValidationError(`${path} is not an array`);
		}

		if (schema.required && !value.length) {
			throw new ValidationError(`${path} at least has one item`);
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

		if (schema.custom) {
			const custom = schema.custom(value);

			if (typeof custom === 'string') {
				throw new ValidationError(custom);
			} else if (!custom) {
				throw new ValidationError(`${path} is invalid array`);
			}
		}
	}

	/**
	 * useful for validating object and the properties inside
	 */
	public object(value: any, schema: ObjectSchema, path: string = 'value') {
		if (typeof value !== 'object' || value === null) {
			throw new ValidationError(`${path} is not an object`);
		}

		if (schema.required && Object.keys(value).length === 0) {
			throw new ValidationError(`${path} is required`);
		}

		for (const key in value) {
			const newPath = `${path === 'value' ? 'root' : path}.${key}`;
			const propertySchema = schema.properties[key];
			const propertyValue = value[key];

			if (!Object.hasOwn(schema.properties, key)) {
				throw new ValidationError(`${newPath} is not allowed`);
			}

			if (propertySchema.type === 'array') {
				this.array(propertyValue, propertySchema, newPath);
			} else if (propertySchema.type === 'object') {
				this.object(propertyValue, propertySchema, newPath);
			} else {
				this.primitive(propertyValue, propertySchema, newPath);
			}
		}

		if (schema.custom) {
			const custom = schema.custom(value);

			if (typeof custom === 'string') {
				throw new ValidationError(custom);
			} else if (!custom) {
				throw new ValidationError(`${path} is invalid object`);
			}
		}
	}
})();
