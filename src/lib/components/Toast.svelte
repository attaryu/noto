<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import { cva } from 'class-variance-authority';

	import Button from './Button.svelte';
	import Text from './Text.svelte';

	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	const toastCVA = cva('flex items-center rounded-lg border pointer-events-auto', {
		variants: {
			type: {
				success:
					'bg-emerald-200 border-emerald-400 *:bg-transparent *:text-emerald-800 shadow-emerald-200',
				error: 'bg-red-200 border-red-400 *:bg-transparent *:text-red-800 shadow-red-200',
				info: 'bg-white shadow-white',
			},
		},
		defaultVariants: {
			type: 'info',
		},
	});

	const toastStore = getToastStoreContext();

	// for testing purposes
	// const toastStore = {
	// 	toasts: [
	// 		{
	// 			message: 'This is a success message',
	// 			type: 'success' as const,
	// 		},
	// 		{
	// 			message: 'This is an error message',
	// 			type: 'error' as const,
	// 		},
	// 		{
	// 			message: 'This is an info message',
	// 			type: 'info' as const,
	// 		}
	// 	]
	// };
</script>

<aside class="pointer-events-none fixed inset-x-4 top-4 z-[99] min-h-8 space-y-2">
	{#each toastStore.toasts as { message, type } (message)}
		<div
			class={toastCVA({ type })}
			animate:flip={{ duration: 300, delay: 50 }}
			in:fly={{ duration: 300, y: '-50%' }}
			out:scale={{ duration: 300 }}
		>
			<Text class="w-full p-4">{message}</Text>

			<div>
				<Button
					variant="secondary"
					class="rounded-none border-none bg-transparent p-4"
					onclick={() => toastStore.unsetToast(message)}
				>
					<X size="16" />
				</Button>
			</div>
		</div>
	{/each}
</aside>
