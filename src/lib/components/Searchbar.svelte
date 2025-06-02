<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { m } from 'paraglide/messages';

	import Input from './Input.svelte';

	import mergeClass from '$lib/utils/merge';

	interface Props {
		class?: string;
		placeholder?: string;
		value?: string;
	}

	let {
		class: className,
		value = $bindable(),
		placeholder = m['search_component.placholder'](),
	}: Props = $props();
</script>

<Input {placeholder} type="text" class={mergeClass('p-3', className)} bind:value>
	{#snippet icon(props)}
		<Search {...props} />
	{/snippet}
</Input>
