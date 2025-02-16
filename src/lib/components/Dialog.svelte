<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import { cva } from 'class-variance-authority';

	import Button from './Button.svelte';
	import Text from './Text.svelte';

	import { getDialogStoreContext } from '$lib/stores/dialog.svelte';

	const dialogCVA = cva('flex items-center rounded-lg border', {
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

	const dialogStore = getDialogStoreContext();

	// for testing purposes
	// const dialogStore = {
	// 	dialogs: [
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

<aside class="fixed inset-x-4 top-4 z-[99] min-h-8 space-y-2">
	{#each dialogStore.dialogs as { message, type } (message)}
		<div
			class={dialogCVA({ type })}
			animate:flip={{ duration: 300, delay: 50 }}
			in:fly={{ duration: 300, y: '-50%' }}
			out:scale={{ duration: 300 }}
		>
			<Text class="w-full p-4">{message}</Text>

			<div>
				<Button
					variant="secondary"
					class="rounded-none border-none bg-transparent p-4"
					onclick={() => dialogStore.unsetDialog(message)}
				>
					<X size="16" />
				</Button>
			</div>
		</div>
	{/each}
</aside>
