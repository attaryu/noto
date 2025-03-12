<script lang="ts">
	import type { Editor, JSONContent } from '@tiptap/core';

	import _ from 'lodash';
	import { ArrowLeft, Check, Pencil, X, RotateCcw } from 'lucide-svelte';

	import Button from '../Button.svelte';
	import Header from '../Header.svelte';
	import Text from '../Text.svelte';
	import { schemaComparison } from '$lib/utils/schemaComparison';

	interface Props {
		title: string;
		editorInstance: Editor;
		originalData?: JSONContent;
		onsave?: () => void;
	}

	const { title, editorInstance, originalData, onsave }: Props = $props();

	const firstSchema = editorInstance.getJSON();

	const controlButtons = $derived([
		{
			id: 'cancel',
			disabled:
				!editorInstance.isEditable ||
				schemaComparison(editorInstance.getJSON(), originalData ?? firstSchema),
			icon: originalData ? RotateCcw : X,
			onclick: () => {
				if (originalData) {
					editorInstance
						.chain()
						.focus('end', { scrollIntoView: false })
						.setContent(originalData)
						.run();
				} else {
					editorInstance.chain().focus('end', { scrollIntoView: false }).clearContent().run();
				}
			},
		},
		{
			id: 'edit',
			disabled: editorInstance.isEmpty,
			icon: editorInstance.isEditable ? Check : Pencil,
			onclick: () => {
				editorInstance.setEditable(!editorInstance.isEditable);

				if (editorInstance.isEditable) {
					editorInstance.commands.focus('end', { scrollIntoView: false });
				} else {
					onsave?.();
				}
			},
		},
	]);
</script>

<Header class="flex items-center bg-zinc-900 p-1">
	<Button variant="secondary">
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
