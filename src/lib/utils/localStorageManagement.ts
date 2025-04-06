class LocalStorage {
	private _key = {
		SECRET_KEY: 'SECRET_KEY',
	};

	get key() {
		return this._key;
	}

	public store(key: string, value?: any) {
		if (value) {
			localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
		}
	}

	public get(key: string) {
		const value = localStorage.getItem(key);

		if (value) {
			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		}

		return null;
	}

	public remove(key: string) {
		localStorage.removeItem(key);
	}
}

const localStorageManagement = new LocalStorage();

export default localStorageManagement;
