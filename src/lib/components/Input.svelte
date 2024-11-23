<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	import mergeClass from '$lib/utils/merge';

	const { class: className, ...props }: SvelteHTMLElements['input'] = $props();
</script>

<input
	class={mergeClass('w-fit rounded-2xl border border-neutral-400 p-3', className)}
	{...props}
/>
