<script lang="ts">
	import type { Snippet } from 'svelte';

	import Dialog from '$lib/components/Dialog.svelte';

	import { setDialogStoreContext } from '$lib/stores/dialog.svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	// initialize the stores
	setDialogStoreContext();
</script>

{@render children()}

<Dialog />
