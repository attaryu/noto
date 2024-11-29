<script lang="ts">
	import type { Editor } from '@tiptap/core';

	import _ from 'lodash';
	import { Check, MoveLeft, Pencil, X } from 'lucide-svelte';

	import Button from '../Button.svelte';
	import Header from '../Header.svelte';
	import Text from '../Text.svelte';

	interface Props {
		title: string;
		editorInstance: Editor;
		originalData: any;
	}

	let { title, editorInstance, originalData }: Props = $props();

	const controlButtons = $derived([
		{
			icon: X,
			/**
			 * determine whether the editor is empty?
			 * Or, is the original data the same as the data in the editor?
			 */
			disabled: originalData
				? _.isEqual(editorInstance.getJSON(), originalData)
				: editorInstance.isEmpty,
			onclick: () => editorInstance.commands.setContent(originalData ?? ''),
		},
		{
			icon: editorInstance.isEditable ? Check : Pencil,
			disabled: false,
			onclick: () => {
				editorInstance.commands.focus();
				editorInstance.setEditable(!editorInstance.isEditable);
				originalData = editorInstance.getJSON();
			},
		},
	]);
</script>

<Header class="flex items-center bg-zinc-900 p-1">
	<Button variant="secondary">
		<MoveLeft />
	</Button>

	<Text tag="h3" class="ml-4 text-white">{title}</Text>

	<div class="ml-auto mr-2 flex gap-2">
		{#each controlButtons as controlButton}
			{@const Icon = controlButton.icon}

			{#key editorInstance}
				<Button
					class="p-2 disabled:bg-zinc-900"
					disabled={controlButton.disabled}
					ontouchstartcapture={(event) => {
						event.preventDefault();
						event.currentTarget.blur();

						controlButton.onclick();
					}}
				>
					<Icon class="pointer-events-none" />
				</Button>
			{/key}
		{/each}
	</div>
</Header>
