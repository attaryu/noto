<script lang="ts">
	import { Search } from 'lucide-svelte';

	import Input from './Input.svelte';

	interface Props {
		class?: string;
		placeholder?: string;
		value?: string;
	}

	let { class: className, value = $bindable(), placeholder = 'Search' }: Props = $props();
</script>

<Input {placeholder} type="text" class={className} bind:value>
	{#snippet icon(props)}
		<Search {...props} />
	{/snippet}
</Input>
