<script lang="ts">
	import type { Snippet } from 'svelte';

	import DropdownBase from './DropdownBase.svelte';

	interface Item {
		title: string;
		action: () => void;
	}

	type Props = {
		items: Array<Item>;
		class?: string;
		disabled?: boolean;
		placeholder: string | Snippet;
	};

	const { class: className, disabled, items, placeholder }: Props = $props();
</script>

<DropdownBase class="min-w-fit px-2.5 py-1.5 {className}" {disabled} {items} display={placeholder}>
	{#snippet itemRender(className, item)}
		<button class={className} onclick={item.action}>{item.title}</button>
	{/snippet}
</DropdownBase>
