<script lang="ts">
	import type { Snippet } from 'svelte';

	import Navigation from '$lib/components/Navigation.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}

<Navigation />
