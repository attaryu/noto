<script lang="ts">
	import type { Snippet } from 'svelte';

	import X from '@lucide/svelte/icons/x';
	import { fade } from 'svelte/transition';

	import Text from './Text.svelte';

	interface Props {
		children: Snippet;
		open: boolean;
		title: string;
		class?: string;
		preventClose?: boolean;
	}

	let { open = $bindable(), children, preventClose, title, class: className }: Props = $props();

	function close() {
		if (!preventClose) {
			open = false;
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 grid place-items-center bg-black/60"
		transition:fade={{ duration: 100 }}
		role="none"
		onclick={(event) => {
			// close dialog when clicking outside of dialog box
			if (event.currentTarget === event.target) {
				close();
			}
		}}
	>
		<div class="max-h-1/2 relative w-3/4 space-y-3 rounded-xl bg-white p-3 shadow-lg">
			<div class="flex gap-4">
				<Text tag="h1" styling="h3">{title}</Text>

				<button
					type="button"
					class="group absolute right-3 top-3 ml-auto rounded-full bg-zinc-200 p-1 transition duration-200 hover:bg-zinc-100"
					onclick={close}
				>
					<X size={16} class="text-zinc-600 transition duration-200 group-hover:text-zinc-400" />
				</button>
			</div>

			<div class={className}>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
