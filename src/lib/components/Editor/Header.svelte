<script lang="ts" generics="IResponse, IPayload">
	import type { Editor, JSONContent } from '@tiptap/core';

	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Check from '@lucide/svelte/icons/check';
	import Pencil from '@lucide/svelte/icons/pencil';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import X from '@lucide/svelte/icons/x';

	import Header from '../Header.svelte';
	import Text from '../Text.svelte';

	import { schemaComparison } from '$lib/utils/schemaComparison';

	interface Props {
		mode: 'create' | 'edit';
		title: string;
		editorInstance: Editor;
		disabled?: boolean;
		onsave: () => void;
		originalData?: JSONContent;
	}

	const { title, editorInstance, originalData, disabled, mode, onsave }: Props = $props();
	const firstSchema = editorInstance.getJSON();

	const controlButtons = $derived.by(() => {
		if (mode === 'create') {
			return [
				{
					id: 'reset',
					disabled: !editorInstance.isEditable,
					icon: X,
					onclick: () =>
						editorInstance.chain().focus('end', { scrollIntoView: false }).clearContent().run(),
				},
				{
					id: 'save',
					disabled: editorInstance.isEmpty || disabled,
					icon: Check,
					onclick: () => {
						editorInstance.setEditable(!editorInstance.isEditable);
						onsave();
					},
				},
			];
		}

		const isSameSchema = schemaComparison(editorInstance.getJSON(), originalData ?? firstSchema);

		return [
			{
				id: 'cancel',
				disabled: !editorInstance.isEditable || disabled || isSameSchema,
				icon: RotateCcw,
				onclick: () => {
					editorInstance
						.chain()
						.focus('end', { scrollIntoView: false })
						.setContent(originalData!)
						.run();
				},
			},
			{
				id: 'edit',
				disabled: disabled,
				icon: editorInstance.isEditable ? Check : Pencil,
				onclick: () => {
					editorInstance.setEditable(!editorInstance.isEditable);

					if (editorInstance.isEditable) {
						editorInstance.commands.focus('end', { scrollIntoView: false });
					} else if (!isSameSchema) {
						onsave();
					}
				},
			},
		];
	});
</script>

<Header class="flex items-center bg-zinc-800 p-1">
	<a href="/app/notes" class="rounded-full bg-white p-3">
		<ArrowLeft size={26} />
	</a>

	<Text tag="h3" class="ml-4 text-white">{title}</Text>

	<div class="mr-2 ml-auto flex gap-2">
		{#each controlButtons as controlButton (controlButton.id)}
			{@const Icon = controlButton.icon}

			<button
				class="p-3 text-white disabled:text-zinc-500"
				disabled={controlButton.disabled}
				ontouchend={(event) => {
					event.preventDefault();
					controlButton.onclick();
				}}
				onmouseup={(event) => {
					event.preventDefault();
					controlButton.onclick();
				}}
			>
				<Icon size={26} />
			</button>
		{/each}
	</div>
</Header>
