<script lang="ts">
	import type { Icon } from '@lucide/svelte';
	import type { Editor } from '@tiptap/core';

	import AlignCenter from '@lucide/svelte/icons/align-center';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import AlignRight from '@lucide/svelte/icons/align-right';
	import Bold from '@lucide/svelte/icons/bold';
	import Heading1 from '@lucide/svelte/icons/heading-1';
	import Heading2 from '@lucide/svelte/icons/heading-2';
	import Heading3 from '@lucide/svelte/icons/heading-3';
	import Italic from '@lucide/svelte/icons/italic';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import Redo from '@lucide/svelte/icons/redo';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import Undo from '@lucide/svelte/icons/undo';
	import { slide } from 'svelte/transition';

	type Props = {
		editorInstance: Editor;
	};

	const { editorInstance }: Props = $props();

	type ControlButtons = (
		| {
				id: string;
				type: 'control';
				icon: typeof Icon;
				isActive: boolean;
				action: () => void;
		  }
		| { id: string; type: 'split' }
	)[];

	const controlButtons: ControlButtons = $derived([
		{
			id: 'undo',
			type: 'control',
			icon: Undo,
			isActive: editorInstance.can().undo(),
			action: () => editorInstance.chain().focus().undo().run(),
		},
		{
			id: 'redo',
			type: 'control',
			icon: Redo,
			isActive: editorInstance.can().redo(),
			action: () => editorInstance.chain().focus().redo().run(),
		},
		{
			id: 'split-1',
			type: 'split',
		},
		{
			id: 'bold',
			type: 'control',
			icon: Bold,
			isActive: editorInstance.isActive('bold'),
			action: () => editorInstance!.chain().focus().toggleBold().run(),
		},
		{
			id: 'italic',
			type: 'control',
			icon: Italic,
			isActive: editorInstance.isActive('italic'),
			action: () => editorInstance!.chain().focus().toggleItalic().run(),
		},
		{
			id: 'underline',
			type: 'control',
			icon: UnderlineIcon,
			isActive: editorInstance.isActive('underline'),
			action: () => editorInstance!.chain().focus().toggleUnderline().run(),
		},
		{
			id: 'split-2',
			type: 'split',
		},
		{
			id: 'heading-1',
			type: 'control',
			icon: Heading1,
			isActive: editorInstance.isActive('heading', { level: 1 }),
			action: () => editorInstance!.chain().focus().toggleHeading({ level: 1 }).run(),
		},
		{
			id: 'heading-2',
			type: 'control',
			icon: Heading2,
			isActive: editorInstance.isActive('heading', { level: 2 }),
			action: () => editorInstance!.chain().focus().toggleHeading({ level: 2 }).run(),
		},
		{
			id: 'heading-3',
			type: 'control',
			icon: Heading3,
			isActive: editorInstance.isActive('heading', { level: 3 }),
			action: () => editorInstance!.chain().focus().toggleHeading({ level: 3 }).run(),
		},
		{
			id: 'split-3',
			type: 'split',
		},
		{
			id: 'bullet-list',
			type: 'control',
			icon: List,
			isActive: editorInstance.isActive('bulletList'),
			action: () => editorInstance!.chain().focus().toggleBulletList().run(),
		},
		{
			id: 'ordered-list',
			type: 'control',
			icon: ListOrdered,
			isActive: editorInstance.isActive('orderedList'),
			action: () => editorInstance!.chain().focus().toggleOrderedList().run(),
		},
		{
			id: 'split-4',
			type: 'split',
		},
		{
			id: 'align-left',
			type: 'control',
			icon: AlignLeft,
			isActive: editorInstance.isActive({ textAlign: 'left' }),
			action: () => editorInstance!.chain().focus().setTextAlign('left').run(),
		},
		{
			id: 'align-right',
			type: 'control',
			icon: AlignRight,
			isActive: editorInstance.isActive({ textAlign: 'right' }),
			action: () => editorInstance!.chain().focus().setTextAlign('right').run(),
		},
		{
			id: 'align-center',
			type: 'control',
			icon: AlignCenter,
			isActive: editorInstance.isActive({ textAlign: 'center' }),
			action: () => editorInstance!.chain().focus().setTextAlign('center').run(),
		},
	]);

	let touchStartX = $state(0);
	let touchStartY = $state(0);

	/**
	 * Threshold for touch events to be considered a tap
	 */
	const touchThreshold = 10;

	/**
	 * Handle touch start event to get the initial touch position for swipe detection
	 */
	const handleTouchStart = (event: TouchEvent) => {
		touchStartX = event.targetTouches[0].clientX;
		touchStartY = event.targetTouches[0].clientY;
	};

	/**
	 * Handle touch end event to detect if the touch was a tap
	 */
	const handleTouchEnd = (cb?: () => void) => (event: TouchEvent) => {
		const touch = event.changedTouches[0];

		const diffX = Math.abs(touch.clientX - touchStartX);
		const diffY = Math.abs(touch.clientY - touchStartY);

		// run the callback if the touch was a tap with a small movement
		if (diffX < touchThreshold && diffY < touchThreshold) {
			event.preventDefault();
			cb?.();
		}
	};

	const handleClick =
		(cb?: () => void) => (event: EventParameter<MouseEvent, HTMLButtonElement>) => {
			event.preventDefault();
			cb?.();
		};
</script>

{#if editorInstance.isFocused}
	<div class="fixed inset-x-0 bottom-0 z-10">
		<div
			class="mx-auto flex max-w-[440px] items-center gap-4 overflow-x-auto bg-zinc-900 p-4"
			transition:slide
		>
			{#each controlButtons as controlButton (controlButton.id)}
				{#if controlButton.type === 'control'}
					{@const Icon = controlButton.icon}

					<button
						class={'rounded-full p-3 text-white disabled:text-zinc-500' +
							(controlButton.isActive ? ' bg-tertiary-1 text-zinc-900' : ' bg-zinc-900')}
						onmouseup={handleClick(controlButton.action)}
						ontouchend={handleTouchEnd(controlButton.action)}
						ontouchstart={handleTouchStart}
					>
						<Icon size={26} />
					</button>
				{:else}
					<div class="h-8 w-px shrink-0 rounded-full bg-zinc-700"></div>
				{/if}
			{/each}
		</div>
	</div>
{/if}
