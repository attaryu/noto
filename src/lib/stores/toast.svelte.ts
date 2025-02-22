import { getContext, hasContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

interface Toast {
	message: string;
	type: 'error' | 'success' | 'info';
	timeout: NodeJS.Timeout;
}

/**
 * ToastStore for managing toast messages data
 */
class ToastStore {
	/**
	 * Duration of the toast message in milliseconds
	 */
	private duration = 5000;

	/**
	 * Maximum number of toast messages
	 */
	private MAX = 3;

	/**
	 * Toast list
	 */
	private _toasts = new SvelteMap<string, Toast>();

	get toasts() {
		return this._toasts.values();
	}

	get size() {
		return this._toasts.size;
	}

	/**
	 * Set toast message
	 *
	 * @param value message to be displayed
	 */
	public setToast(props: { message: string; type: 'error' | 'success' | 'info' }) {
		// Check if the toast message is not already in the list before adding it
		if (!this._toasts.has(props.message)) {
			// Check if the toast list size is greater than the maximum allowed
			if (this._toasts.size >= this.MAX) {
				const firstToast = Array.from(this._toasts.values()).shift();

				if (firstToast) {
					this.unsetToast(firstToast.message);
				}
			}

			this._toasts.set(props.message, {
				...props,
				timeout: setTimeout(() => this.unsetToast(props.message), this.duration),
			});
		}
	}

	/**
	 *
	 * @param message toast message
	 */
	public unsetToast(message: string) {
		const toast = this._toasts.get(message);

		if (toast) {
			clearTimeout(toast.timeout);
			this._toasts.delete(toast.message);
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
