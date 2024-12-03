<script lang="ts" generics="Item">
	import { onDestroy, onMount, type Snippet } from 'svelte';

	import { ChevronRight } from 'lucide-svelte';

	import mergeClass from '$lib/utils/merge';
	import Text from './Text.svelte';

	type Props = {
		items: Array<Item>;
		itemRender: Snippet<[string, Item]>;
		display: string | Snippet;
		class?: string;
	};

	const { class: className, items, display, itemRender }: Props = $props();

	let dropdownRef: HTMLDivElement | undefined;
	let buttonRef: HTMLButtonElement | undefined;
	let itemsParentRef: HTMLUListElement | undefined = $state();

	let isOpen = $state(false);
	let listPosition: 'above' | 'below' = $state('below');

	function openDropdown() {
		// <!--? Determine the position of the dropdown list appears --->

		const dropdownPosition = buttonRef?.getBoundingClientRect().top;

		if (dropdownPosition) {
			const screenSize = window.innerHeight;
			listPosition = dropdownPosition < screenSize / 2 ? 'below' : 'above';
		}

		isOpen = !isOpen;
	}

	function forceClose(event: MouseEvent) {
		// <!--? Forced the dropdown close after selecting items or clicking other elements --->

		const isItem = itemsParentRef?.contains(event.target as Node);
		const isNotDropdown = !dropdownRef?.contains(event.target as Node);

		if (isNotDropdown || isItem) {
			isOpen = false;
		}
	}

	onMount(() => document.addEventListener('click', forceClose));
	onDestroy(() => document.removeEventListener('click', forceClose));
</script>

<div class="relative" bind:this={dropdownRef}>
	<!--? select button -->
	<button
		bind:this={buttonRef}
		onclick={openDropdown}
		class={mergeClass(
			'flex min-w-24 items-center justify-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-white',
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
			class="absolute right-0 z-10 min-w-full rounded-2xl bg-zinc-900 text-white shadow-xl"
			class:above={listPosition === 'above'}
			class:below={listPosition === 'below'}
			bind:this={itemsParentRef}
		>
			{#each items as item}
				<li>
					{@render itemRender('px-4 py-2 disabled:text-zinc-500', item)}
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
