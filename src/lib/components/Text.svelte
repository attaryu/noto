<script lang="ts">
	import type { VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';

	import { cva } from 'class-variance-authority';

	import Proxy from './Proxy.svelte';
	import mergeClass from '$lib/utils/merge';

	type Props = {
		class?: string;
		children?: Snippet<[]>;
		as?: Snippet<[any]>;
	} & VariantProps<typeof textCVA>;

	const { children, as, tag = 'p', class: className }: Props = $props();

	const textCVA = cva('leading-relaxed', {
		variants: {
			tag: {
				h1: 'font-medium text-4xl text-zinc-900',
				h2: 'font-medium text-2xl text-zinc-900',
				h3: 'font-medium text-xl text-zinc-900',
				p: 'text-zinc-600',
				small: 'text-sm text-zinc-600',
			},
		},
	});

	const modifiedProps = {
		class: mergeClass(textCVA({ tag, className })),
	};
</script>

<Proxy {as} {...modifiedProps}>
	{#snippet fallback()}
		<svelte:element this={tag} {...modifiedProps}>
			{@render children?.()}
		</svelte:element>
	{/snippet}

	{@render children?.()}
</Proxy>
