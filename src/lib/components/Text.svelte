<script lang="ts">
	import type { VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	import { cva } from 'class-variance-authority';

	import Proxy from './Proxy.svelte';
	import mergeClass from '$lib/utils/merge';

	type Props = {
		as?: Snippet<[any]>;
		styling?: VariantProps<typeof textCVA>['tag'];
	} & VariantProps<typeof textCVA> &
		(
			| SvelteHTMLElements['h1']
			| SvelteHTMLElements['h2']
			| SvelteHTMLElements['h3']
			| SvelteHTMLElements['p']
		);

	const { children, as, tag = 'p', styling, class: className, ...props }: Props = $props();

	const textCVA = cva('leading-relaxed block', {
		variants: {
			tag: {
				h1: 'font-medium text-4xl text-zinc-900',
				h2: 'font-medium text-2xl text-zinc-900',
				h3: 'font-medium text-xl text-zinc-900',
				p: 'xl:text-lg text-zinc-700',
				small: 'text-sm text-zinc-600',
			},
		},
	});

	const modifiedProps = {
		...props,
		class: mergeClass(textCVA({ tag: styling ?? tag, className })),
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
