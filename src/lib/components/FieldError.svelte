<script lang="ts">
	import type { Snippet } from 'svelte';

	import mergeClass from '$lib/utils/merge';
	import Text from './Text.svelte';

	interface Props {
		class?: string;
		message?: string | string[] | null;
	}

	const { message, class: className }: Props = $props();

	const _message = $derived(Array.isArray(message) ? message[0] : message);
</script>

{#if _message}
	<Text tag="small" class={mergeClass('text-center text-red-500', className)}>
		{_message}
	</Text>
{/if}
