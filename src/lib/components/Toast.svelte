<script lang="ts">
	import { cva } from 'class-variance-authority';
	import X from '@lucide/svelte/icons/x';
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';

	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	const toastCVA = cva(
		'flex w-fit p-3 gap-2.5 rounded-lg shadow-lg shadow-black/20 bg-zinc-900 pointer-events-auto mx-auto ',
		{
			variants: {
				type: {
					success: 'text-emerald-300',
					error: 'text-red-300',
					info: 'text-white',
				},
			},
		},
	);

	const toastStore = getToastStoreContext();

	// for testing purposes
	// const toastStore = {
	// 	toasts: [
	// 		{
	// 			message: 'this is a success message',
	// 			type: 'success' as const,
	// 		},
	// 		{
	// 			message: 'This is a info message with action',
	// 			action: {
	// 				title: 'Undo',
	// 				event: () => alert('Undo'),
	// 			},
	// 			type: 'info' as const,
	// 		},
	// 		{
	// 			message: 'This is an error with action',
	// 			action: {
	// 				title: 'Retry',
	// 				event: () => alert('Retry'),
	// 			},
	// 			type: 'error' as const,
	// 		},
	// 	],
	// 	unset: (message: string) => {
	// 		alert(`Unsetting toast: ${message}`);
	// 	},
	// };
</script>

<aside class="pointer-events-none fixed inset-x-4 bottom-24 z-99 space-y-4">
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class={toastCVA({ type: toast.type })}
			animate:flip={{ duration: 300, delay: 50 }}
			in:fly={{ duration: 300, y: '50%' }}
			out:scale={{ duration: 300 }}
		>
			<p class="mr-3 font-medium text-sm">{toast.message}</p>

			{#if toast.action}
				<button
					class="text-sm text-white! underline"
					onclick={() => {
						toast.action!.event();
						toastStore.unset(toast.id);
					}}
				>
					{toast.action.title}
				</button>
			{/if}

			<button class="text-white!" onclick={() => toastStore.unset(toast.id)}>
				<X size="16" />
			</button>
		</div>
	{/each}
</aside>
