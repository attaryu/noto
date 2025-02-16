import { getContext, hasContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

interface Dialog {
	message: string;
	type: 'error' | 'success' | 'info';
	timeout: NodeJS.Timeout;
}

/**
 * DialogStore for managing dialog messages data
 */
class DialogStore {
	/**
	 * Duration of the dialog message in milliseconds
	 */
	private duration = 5000;

	/**
	 * Maximum number of dialog messages
	 */
	private MAX = 3;

	/**
	 * Dialog list
	 */
	private _dialogs = new SvelteMap<string, Dialog>();

	get dialogs() {
		return this._dialogs.values();
	}

	get size() {
		return this._dialogs.size;
	}

	/**
	 * Set dialog message
	 *
	 * @param value message to be displayed
	 */
	public setDialog(props: { message: string; type: 'error' | 'success' | 'info' }) {
		// Check if the dialog message is not already in the list before adding it
		if (!this._dialogs.has(props.message)) {
			// Check if the dialog list size is greater than the maximum allowed
			if (this._dialogs.size >= this.MAX) {
				const firstDialog = Array.from(this._dialogs.values()).shift();

				if (firstDialog) {
					this.unsetDialog(firstDialog.message);
				}
			}

			this._dialogs.set(props.message, {
				...props,
				timeout: setTimeout(() => this.unsetDialog(props.message), this.duration),
			});
		}
	}

	/**
	 *
	 * @param message dialog message
	 */
	public unsetDialog(message: string) {
		const dialog = this._dialogs.get(message);

		if (dialog) {
			clearTimeout(dialog.timeout);
			this._dialogs.delete(dialog.message);
		}
	}
}

const dialogStoreKey = Symbol('DIALOG_STORE_CONTEXT');

export function setDialogStoreContext() {
	const store = new DialogStore();

	// check context to avoid duplicate context
	if (!hasContext(dialogStoreKey)) {
		setContext(dialogStoreKey, store);
	}
}

export function getDialogStoreContext() {
	return getContext<DialogStore>(dialogStoreKey);
}
