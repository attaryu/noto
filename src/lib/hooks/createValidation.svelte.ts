import type { ZodObject } from 'zod';

/**
 * createValidation hook to validate form fields
 *
 * @param initialValue initial form fields value
 * @param validation zod object schema to validate form fields
 */
export function createValidation<Type>(initialValue: Type, validation: ZodObject<any>) {
	/**
	 * live validation flag to validate form fields every time they change.
	 * activate it by user submitting the form once.
	 */
	let _liveValidationFlag = $state(false);

	/**
	 * form fields state
	 */
	const fields = $state<Type>(initialValue);

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
	 *
	 * @returns boolean
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

		// iterate over field errors and set them to the errors state
		fieldErrors.forEach(([field, messages]) => {
			if (messages) {
				newErrors[field as keyof Type] = messages.join(', ');
			}
		});

		_errors = newErrors;

		if (!validationResult.success) {
			return false;
		}

		return true;
	}

	/**
	 * submit handler to prevent default form submission and validate form fields
	 *
	 * @param fn callback function to be called when form is submitted
	 */
	const submitHandler =
		(fn: (fields: Type) => void | Promise<void>) =>
		(e: EventParameter<SubmitEvent, HTMLFormElement>) => {
			e.preventDefault();
			e.stopPropagation();

			if (!_liveValidationFlag) {
				_liveValidationFlag = true;
			}

			console.log('submitted');
			if (!validate()) {
				return;
			}

			fn(fields);
		};

	return {
		/**
		 * form field errors state
		 */
		get errors() {
			return _errors;
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
