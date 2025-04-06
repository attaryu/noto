<script lang="ts">
	import type { Snippet } from 'svelte';

	import Toast from '$lib/components/Toast.svelte';

	import { setToastStoreContext } from '$lib/stores/toast.svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	// initialize the stores
	setToastStoreContext();
</script>

{@render children()}

<Toast />
