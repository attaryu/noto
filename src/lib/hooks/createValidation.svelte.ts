import _ from 'lodash';
import type { ZodObject } from 'zod';

/**
 * createValidation hook to validate form fields. Using svelte 5 uninversal states.
 *
 * @param initialValue initial form fields value
 * @param validation zod object schema to validate form fields
 */
export function createValidation<Type>(validation: ZodObject<any>, initialValue: Type) {
	/**
	 * form validity state
	 */
	let _isValid = $state<boolean>(true);

	/**
	 * form fields state
	 */
	const fields = $state<Type>(initialValue);

	/**
	 * live validation flag to validate form fields every time they change.
	 * activate it by user submitting the form once.
	 */
	let _liveValidationFlag = $state(false);

	/**
	 * form field errors state
	 */
	let _errors = $state.raw<Partial<Record<keyof Type, string | null>>>({});

	/**
	 * validate form fields every time they change
	 */
	$effect(() => {
		if (_liveValidationFlag && fields) {
			validate();
		}
	});

	/**
	 * validate form fields every time they change or submitted
	 */
	function validate() {
		const validationResult = validation.safeParse(fields);

		/**
		 * flatten error object to easily access field errors
		 *
		 * @see https://zod.dev/ERROR_HANDLING?id=flattening-errors
		 */
		const fieldErrors = Object.entries(validationResult.error?.flatten().fieldErrors ?? {});

		const newErrors: Partial<Record<keyof Type, string | null>> = {};

		// iterate over field errors and set them to the temporary errors object
		fieldErrors.forEach(([field, messages]) => {
			if (messages) {
				newErrors[field as keyof Type] = messages.join(', ');
			}
		});

		// avoid re-render if the new error is same as the old one
		if (!_.isEqual(_errors, newErrors)) {
			_errors = newErrors;
		}

		if (!validationResult.success) {
			_isValid = false;

			return false;
		}

		_isValid = true;

		return true;
	}

	/**
	 * submit handler to prevent default form submission and validate form fields
	 *
	 * @param callback function to be called when form is valid
	 */
	const submitHandler =
		(callback: (fields: Type) => void | Promise<void>) =>
		(e: EventParameter<SubmitEvent, HTMLFormElement>) => {
			e.preventDefault();
			e.stopPropagation();

			if (!_liveValidationFlag) {
				_liveValidationFlag = true;
			}

			if (!validate()) {
				return;
			}

			// destructuring fields to remove proxy object
			callback({ ...fields });
		};

	return {
		/**
		 * form field errors state
		 */
		get errors() {
			return _errors;
		},

		/**
		 * form validity state
		 */
		get isValid() {
			return _isValid;
		},

		/**
		 * form fields state
		 */
		fields,

		/**
		 * validate form fields every time they change or submitted
		 */
		submitHandler,
	};
}
