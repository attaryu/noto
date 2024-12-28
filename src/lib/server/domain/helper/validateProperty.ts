type PrimitiveType = 'string' | 'boolean' | 'number';

/**
 * validateprimive is useful for validating primitive value data type
 *
 * @param value Value that wants to be validated
 * @param type Primitive data type from value (string, boolean, number)
 * @param errorInstance Instance of Error Class
 */
export function validatePrimitive(value: any, type: PrimitiveType, errorInstance: Error): void {
	// ? Value cannot be undefined || Value must be like a type
	if (value === undefined || typeof value !== type) {
		throw errorInstance;
	}

	// ? if the value has string, then it can't be empty
	if (typeof value === 'string' && !value) {
		throw errorInstance;
	}
}

type ValidateArrayOptions = {
	itemRequired?: boolean;
	itemType: PrimitiveType | 'any';
	errorInstance: Error;
};

/**
 * validateArray useful for validating array and the items inside
 *
 * @param array array value
 * @param options options for validation
 */
export function validateArray(array: any[], options: ValidateArrayOptions): void {
	const { itemRequired = false, errorInstance, itemType = 'any' } = options;

	// ? array should be defined || array is array not any else
	if (array === undefined || !Array.isArray(array)) {
		throw errorInstance;
	}

	// ? if item required, array length should not be zero
	if (itemRequired && !array.length) {
		throw errorInstance;
	}

	// ? check every item if itemType not any
	if (itemType !== 'any') {
		for (const item of array) {
			validatePrimitive(item, itemType, errorInstance);
		}
	}
}
