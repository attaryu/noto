<script lang="ts">
	import type { Snippet } from 'svelte';

	import mergeClass from '$lib/utils/merge';
	import Text from './Text.svelte';

	interface Props {
		children?: Snippet;
		className?: string;
	}

	const { children, className }: Props = $props();
</script>

{#if children}
	<Text tag="small" class={mergeClass('text-center text-red-500', className)}
		>{@render children()}</Text
	>
{/if}
