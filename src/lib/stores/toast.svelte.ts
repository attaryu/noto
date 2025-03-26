import { getContext, hasContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export interface IToast {
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
	private _toasts = new SvelteMap<number, IToast>();
	
	/**
	 * message duration in milliseconds
	 */
	private duration = 4000;

	/**
	 * maximum toast
	 */
	private MAX = 3;


	get toasts() {
		return this._toasts.values();
	}

	get size() {
		return this._toasts.size;
	}

	public set(props: Omit<IToast, 'timeout' | 'id'>) {
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

	public unset(id: number) {
		const toast = this._toasts.get(id);

		if (toast) {
			clearTimeout(toast.timeout);
			this._toasts.delete(toast.id);
		}
	}

	public setSuccess(prop: { message?: string; action?: IToast['action'] }): void {
		this.set({
			type: 'success',
			message: 'Success',
			...prop,
		});
	}

	public setInfo(prop: { message: string; action?: IToast['action'] }): void {
		this.set({
			type: 'info',
			...prop,
		});
	}

	public setError(prop: { message?: string; action?: IToast['action'] }): void {
		this.set({
			type: 'success',
			message: 'Error',
			...prop,
		});
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
