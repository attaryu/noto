import type { EditorOptions } from '@tiptap/core';

import { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { readable } from 'svelte/store';

/**
 * tiptap rich text editor framework wrapper
 *
 * @param options - editor options
 * @see [the original idea](https://github.com/sibiraj-s/svelte-tiptap/blob/master/src/lib/createEditor.ts)
 */
export default function createEditor(options: Partial<EditorOptions> = {}) {
	const editor = new Editor({
		...options,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
				history: {
					depth: 50,
				},
			}),
			Placeholder.configure({
				placeholder: 'Note something new here...'
			}),
			Underline,
			TextAlign.configure({
				defaultAlignment: 'left',
				alignments: ['left', 'center', 'right'],
				types: ['heading', 'paragraph'],
			}),
			...(options.extensions ?? []),
		],
	});

	return readable(editor, (set) => {
		editor.on('transaction', () => {
			set(editor);
		});

		return () => {
			editor.destroy();
		};
	});
}
