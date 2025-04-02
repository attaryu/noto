<script lang="ts" generics="IResponse, IPayload">
	import type { Editor, JSONContent } from '@tiptap/core';

	import { ArrowLeft, Check, Pencil, RotateCcw, X } from 'lucide-svelte';

	import Button from '../Button.svelte';
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

<Header class="flex items-center bg-zinc-900 p-1">
	<Button variant="secondary" class="bg-white">
		{#snippet as(props)}
			<a href="/app/notes" {...props}>
				<ArrowLeft />
			</a>
		{/snippet}
	</Button>

	<Text tag="h3" class="ml-4 text-white">{title}</Text>

	<div class="ml-auto mr-2 flex gap-2">
		{#each controlButtons as controlButton (controlButton.id)}
			{@const Icon = controlButton.icon}

			<Button
				class="p-2 disabled:bg-zinc-900"
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
				<Icon />
			</Button>
		{/each}
	</div>
</Header>
