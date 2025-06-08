<script lang="ts" generics="Item">
	import type { Snippet } from 'svelte';

	import { ChevronRight } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	import Text from './Text.svelte';

	import mergeClass from '$lib/utils/merge';

	type Props = {
		items: Array<Item>;
		itemRender: Snippet<[string, Item]>;
		display: string | Snippet;
		disabled?: boolean;
		class?: string;
	};

	const { class: className, disabled, items, display, itemRender }: Props = $props();

	let dropdownRef = $state<HTMLDivElement>();
	let buttonRef = $state<HTMLButtonElement>();
	let itemsParentRef = $state<HTMLUListElement>();

	let isOpen = $state(false);
	let listPosition = $state<'above' | 'below'>('below');

	function openDropdown() {
		// Determine the position of the dropdown list appears

		const dropdownPosition = buttonRef?.getBoundingClientRect().top;

		if (dropdownPosition) {
			const screenSize = window.innerHeight;
			listPosition = dropdownPosition < screenSize / 2 ? 'below' : 'above';
		}

		isOpen = !isOpen;
	}

	function forceClose(event: MouseEvent) {
		// Forced the dropdown close after selecting items or clicking other elements

		const isItem = itemsParentRef?.contains(event.target as Node);
		const isNotDropdown = !dropdownRef?.contains(event.target as Node);

		if (isNotDropdown || isItem) {
			isOpen = false;
		}
	}
</script>

<svelte:document onclick={forceClose} />

<div class="relative" bind:this={dropdownRef}>
	<!--? select button -->
	<button
		bind:this={buttonRef}
		onclick={openDropdown}
		{disabled}
		class={mergeClass(
			'flex min-w-24 items-center justify-center gap-2 rounded-full bg-zinc-800 px-3 py-2 text-white disabled:bg-zinc-800 disabled:text-zinc-500',
			className,
		)}
	>
		{#if typeof display === 'string'}
			<Text class="text-white" tag="small">
				{#snippet as(props)}
					<span {...props}>{display}</span>
				{/snippet}
			</Text>

			<ChevronRight
				size={16}
				class="transition-transform duration-300 {isOpen &&
					(listPosition === 'above' ? '-rotate-45' : 'rotate-45')}"
			/>
		{:else}
			{@render display()}
		{/if}
	</button>

	<!--? list item element -->
	{#if isOpen}
		<ul
			class="absolute right-0 z-10 w-fit rounded-2xl bg-zinc-800 text-white shadow-xl"
			class:above={listPosition === 'above'}
			class:below={listPosition === 'below'}
			bind:this={itemsParentRef}
			transition:fly={{ y: listPosition === 'above' ? 10 : -10, duration: 200 }}
		>
			{#each items as item (item)}
				<li>
					{@render itemRender('px-4 py-2 w-full disabled:text-zinc-500 text-start', item)}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	:root {
		--position: calc(100% + 8px);
	}

	.above {
		bottom: var(--position);
	}

	.below {
		top: var(--position);
	}
</style>
