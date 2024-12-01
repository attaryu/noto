<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		as?: Snippet<[any, any]> | false;
    children: Snippet,
    fallback: Snippet,
	};

	let { as = false, children, fallback, ...props }: Props = $props();
</script>

{#if as}
	{@render as(props, children)}
{:else}
	{@render fallback()}
{/if}
