import type { EditorOptions } from '@tiptap/core';

import { Extension } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { readable } from 'svelte/store';

export default function createEditor(options: Partial<EditorOptions> = {}) {
	const editor = new Editor({
		...options,
		extensions: [
			StarterKit.configure({
				paragraph: {
					HTMLAttributes: {
						class: 'pb-4',
					},
				},
				bold: {
					HTMLAttributes: {
						class: 'font-bold',
					},
				},
				heading: {
					levels: [1, 2, 3],
				},
				history: {
					depth: 50,
				},
			}),
			Placeholder.configure({
				placeholder: 'Note something new here...',
				emptyEditorClass:
					'before:content-[attr(data-placeholder)] float-left h-0 pointer-events-none text-zinc-400 text-xl',
			}),
			Underline,
			TextAlign.configure({
				types: ['header', 'paragraph'],
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
