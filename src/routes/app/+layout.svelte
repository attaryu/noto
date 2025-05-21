<script lang="ts">
	import type { Snippet } from 'svelte';

	import dayjs from 'dayjs';
	import { getLocale } from 'paraglide/runtime';

	import Toast from '$lib/components/Toast.svelte';

	import { setToastStoreContext } from '$lib/stores/toast.svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	// initialize some stores and libraries
	setToastStoreContext();
	dayjs.locale(getLocale());
</script>

<div class="mx-auto max-w-[440px]">
	{@render children()}
</div>

<Toast />

<!-- change language for development only, comment it back after using it! -->
<!-- <button
	class="fixed bottom-4 left-4 z-50 rounded-full bg-black p-2"
	onclick={() => setLocale(getLocale() === 'en' ? 'id' : 'en')}
>
	<Globe class="text-white" />
</button> -->
