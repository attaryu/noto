export function formDataCollector<T>(formData: FormData, objectKeys: (keyof T)[]) {
	const object: Record<string, unknown> = {};

	for (const key of objectKeys) {
		let value: unknown;

		const data = formData.get(key as string)?.toString();

		if (!data) {
			value = null;
		} else if (parseInt(data) || data === '0') {
			value = parseInt(data);
		} else {
			value = data;
		}

		object[key as string] = value;
	}

	return object as T;
}
