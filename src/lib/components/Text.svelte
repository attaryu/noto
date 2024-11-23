<script lang="ts">
	import type { VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';

	import { cva } from 'class-variance-authority';

	import mergeClass from '$lib/utils/merge';

	type Props = {
		class?: string;
		children: Snippet<[]>;
	} & VariantProps<typeof textCVA>;

	const { children, tag = 'p', class: className }: Props = $props();

	const textCVA = cva('leading-relaxed', {
		variants: {
			tag: {
				h1: 'font-medium text-4xl text-neutral-900',
				p: 'text-neutral-600',
				small: 'text-sm text-neutral-600',
			},
		},
	});
</script>

<svelte:element this={tag} class={mergeClass(textCVA({ tag, className }))}>
	{@render children()}
</svelte:element>
