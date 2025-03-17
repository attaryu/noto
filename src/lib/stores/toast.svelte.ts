import { getContext, hasContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

interface Toast {
	id: number;
	message: string;
	type: 'error' | 'success' | 'info';
	action?: {
		title: string;
		event: () => void;
	};
	timeout: NodeJS.Timeout;
}

/**
 * ToastStore for managing toast messages data
 */
class ToastStore {
	/**
	 * Duration of the toast message in milliseconds
	 */
	private duration = 4000;

	/**
	 * Maximum number of toast messages
	 */
	private MAX = 3;

	/**
	 * Toast list
	 */
	private _toasts = new SvelteMap<number, Toast>();

	get toasts() {
		return this._toasts.values();
	}

	get size() {
		return this._toasts.size;
	}

	/**
	 * Set toast message
	 *
	 * @param message toast message to display
	 * @param type toast type (error, success, info)
	 * @param action toast action (optional)
	 */
	public set(props: Omit<Toast, 'timeout' | 'id'>) {
		if (this._toasts.size >= this.MAX) {
			const firstToast = Array.from(this._toasts.values()).shift();

			if (firstToast) {
				this.unset(firstToast.id);
			}
		}

		const id = Date.now();

		this._toasts.set(id, {
			...props,
			id,
			timeout: setTimeout(() => this.unset(id), this.duration),
		});
	}

	/**
	 *
	 * @param message toast message
	 */
	public unset(id: number) {
		const toast = this._toasts.get(id);

		if (toast) {
			clearTimeout(toast.timeout);
			this._toasts.delete(toast.id);
		}
	}
}

const toastStoreKey = Symbol('TOAST_STORE_CONTEXT');

export function setToastStoreContext() {
	const store = new ToastStore();

	// check context to avoid duplicate context
	if (!hasContext(toastStoreKey)) {
		setContext(toastStoreKey, store);
	}
}

export function getToastStoreContext() {
	return getContext<ToastStore>(toastStoreKey);
}
