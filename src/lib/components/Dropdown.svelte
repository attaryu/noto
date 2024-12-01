<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	import mergeClass from '$lib/utils/merge';
	import Text from './Text.svelte';

	interface Item {
		title: string;
		value: string | number;
	}

	type Props = {
		items: Array<Item>;
		selected?: Item;
		class?: string;
	};

	let { class: className, items, selected = $bindable() }: Props = $props();

	let isOpen = $state(false);
	let selectedItem: Item | undefined = $state(selected);
	let listPosition: 'above' | 'below' = $state('below');

	let buttonRef: HTMLButtonElement | null = $state(null);

	const itemOnClickHandler = (item: Item) => () => {
		isOpen = false;
		selectedItem = item;
		selected = item;
	};

	function toggleDropdown() {
		// <!--? Determine the position of the dropdown list appears --->
		const dropdownPosition = buttonRef?.getBoundingClientRect().top;

		if (dropdownPosition) {
			const screenSize = window.innerHeight;
			listPosition = dropdownPosition < screenSize / 2 ? 'below' : 'above';
		}

		isOpen = !isOpen;
	}
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="relative">
	<!--? select button -->
	<button
		bind:this={buttonRef}
		onclick={toggleDropdown}
		class={mergeClass(
			'flex min-w-24 items-center justify-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-white',
			className,
		)}
	>
		<Text class="text-white" tag="small">
			{#snippet as(props)}
				<span {...props}>{selectedItem?.title ?? 'Select Item'}</span>
			{/snippet}
		</Text>

		<ChevronRight
			size={16}
			class="transition-transform duration-300 {isOpen &&
				(listPosition === 'above' ? '-rotate-45' : 'rotate-45')}"
		/>
	</button>

	<!--? list item element -->
	{#if isOpen}
		<ul
			class="absolute right-0 z-10 min-w-full rounded-2xl bg-zinc-900 text-white shadow-xl"
			class:above={listPosition === 'above'}
			class:below={listPosition === 'below'}
		>
			{#each items as item (item.value)}
				<li>
					<button
						class="px-4 py-2 disabled:text-zinc-500"
						disabled={selectedItem?.value === item.value}
						onclick={itemOnClickHandler(item)}>{item.title}</button
					>
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
