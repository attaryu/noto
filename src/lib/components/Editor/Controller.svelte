<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { Icon } from 'lucide-svelte';
	import {
		AlignCenter,
		AlignJustify,
		AlignLeft,
		AlignRight,
		Bold,
		Heading1,
		Heading2,
		Heading3,
		Italic,
		List,
		ListOrdered,
		Redo,
		UnderlineIcon,
		Undo,
	} from 'lucide-svelte';

	import Button from '../Button.svelte';

	type Props = {
		editorInstance: Editor;
	};

	const { editorInstance }: Props = $props();

	type ControlButtons = Array<
		| {
				type: 'control';
				icon: typeof Icon;
				isActive: boolean;
				onclick: () => void;
		  }
		| { type: 'split' }
	>;

	const controlButtons: ControlButtons = $derived([
		{
			type: 'control',
			icon: Undo,
			isActive: editorInstance.can().undo(),
			onclick: () => editorInstance.chain().focus().undo().run(),
		},
		{
			type: 'control',
			icon: Redo,
			isActive: editorInstance.can().redo(),
			onclick: () => editorInstance.chain().focus().redo().run(),
		},
		{
			type: 'split',
		},
		{
			type: 'control',
			icon: Bold,
			isActive: editorInstance.isActive('bold'),
			onclick: () => editorInstance!.chain().focus().toggleBold().run(),
		},
		{
			type: 'control',
			icon: Italic,
			isActive: editorInstance.isActive('italic'),
			onclick: () => editorInstance!.chain().focus().toggleItalic().run(),
		},
		{
			type: 'control',
			icon: UnderlineIcon,
			isActive: editorInstance.isActive('underline'),
			onclick: () => editorInstance!.chain().focus().toggleUnderline().run(),
		},
		{
			type: 'split',
		},
		{
			type: 'control',
			icon: Heading1,
			isActive: editorInstance.isActive('heading', { level: 1 }),
			onclick: () => editorInstance!.chain().focus().toggleHeading({ level: 1 }).run(),
		},
		{
			type: 'control',
			icon: Heading2,
			isActive: editorInstance.isActive('heading', { level: 2 }),
			onclick: () => editorInstance!.chain().focus().toggleHeading({ level: 2 }).run(),
		},
		{
			type: 'control',
			icon: Heading3,
			isActive: editorInstance.isActive('heading', { level: 3 }),
			onclick: () => editorInstance!.chain().focus().toggleHeading({ level: 3 }).run(),
		},
		{
			type: 'split',
		},
		{
			type: 'control',
			icon: List,
			isActive: editorInstance.isActive('bulletList'),
			onclick: () => editorInstance!.chain().focus().toggleBulletList().run(),
		},
		{
			type: 'control',
			icon: ListOrdered,
			isActive: editorInstance.isActive('orderedList'),
			onclick: () => editorInstance!.chain().focus().toggleOrderedList().run(),
		},
		{
			type: 'split',
		},
		{
			type: 'control',
			icon: AlignLeft,
			isActive: editorInstance.isActive({ textAlign: 'left' }),
			onclick: () => editorInstance!.chain().focus().setTextAlign('left').run(),
		},
		{
			type: 'control',
			icon: AlignRight,
			isActive: editorInstance.isActive({ textAlign: 'right' }),
			onclick: () => editorInstance!.chain().focus().setTextAlign('right').run(),
		},
		{
			type: 'control',
			icon: AlignCenter,
			isActive: editorInstance.isActive({ textAlign: 'center' }),
			onclick: () => editorInstance!.chain().focus().setTextAlign('center').run(),
		},
		{
			type: 'control',
			icon: AlignJustify,
			isActive: editorInstance.isActive({ textAlign: 'justify' }),
			onclick: () => editorInstance!.chain().focus().setTextAlign('justify').run(),
		},
	]);
</script>

{#if editorInstance.isFocused}
	<div class="fixed inset-x-0 bottom-0 overflow-x-auto">
		<div class="flex w-fit items-center gap-2 bg-zinc-900 px-4 pb-6 pt-4">
			{#each controlButtons as controlButton}
				{#if controlButton.type === 'control'}
					{@const Icon = controlButton.icon}

					{#key editorInstance}
						<Button
							class="bg-tranparent p-2 {controlButton.isActive && 'bg-tertiary-1 text-zinc-900'}"
							ontouchstartcapture={(event) => {
								event.preventDefault();
								event.currentTarget.blur();
								controlButton.onclick();
							}}
						>
							<Icon />
						</Button>
					{/key}
				{:else}
					<span class="block h-8 w-[1px] rounded-full bg-zinc-600"></span>
				{/if}
			{/each}
		</div>
	</div>
{/if}
