<script lang="ts">
	import type { Snippet } from 'svelte';
	
	import DropdownBase from './DropdownBase.svelte';

	interface Item {
		title: string;
		value: string;
	}

	type Props = {
		items: Array<Item>;
		class?: string;
		placeholder?: string;
		selected?: Item;
	};

	const { class: className, items, placeholder, selected }: Props = $props();

	let selectedItem: Item | undefined = $state(selected);
</script>

<DropdownBase
	class={className}
	{items}
	display={selectedItem?.title ?? placeholder ?? 'Select an item'}
>
	{#snippet itemRender(className, item)}
		<button
			class={className}
			disabled={selectedItem?.value === item.value}
			onclick={() => (selectedItem = item)}>{item.title}</button
		>
	{/snippet}
</DropdownBase>
