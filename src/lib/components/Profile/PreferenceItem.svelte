<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		icon?: Snippet;
		text: string;
		rightElement?: Snippet;
		action?: () => void;
	};

	const { icon, text, rightElement, action }: Props = $props();
</script>

<button class="flex h-14 w-full items-center gap-4 px-4" onclick={action}>
	{@render icon?.()}

	<span class="text-lg">{text}</span>

	<span class="ml-auto">
		{@render rightElement?.()}
	</span>
</button>
