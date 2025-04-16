<script lang="ts">
	import { m } from 'paraglide/messages';

	import DropdownBase from './DropdownBase.svelte';

	interface Item {
		title: string;
		value: string;
	}

	type Props = {
		items: Array<Item>;
		class?: string;
		placeholder?: string;
		selected?: Item['value'];
	};

	let { class: className, items, placeholder, selected = $bindable() }: Props = $props();

	const selectedTitle = $derived(items.find((item) => item.value === selected)?.title);
</script>

<DropdownBase
	class={className}
	{items}
	display={selectedTitle ?? placeholder ?? m['select_component.default_display']()}
>
	{#snippet itemRender(className, item)}
		<button
			class={className}
			disabled={selected === item.value}
			onclick={() => (selected = item.value)}>{item.title}</button
		>
	{/snippet}
</DropdownBase>
