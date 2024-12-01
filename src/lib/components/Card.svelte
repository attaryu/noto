<script lang="ts">
	import type { VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';

	import { cva } from 'class-variance-authority';

	import mergeClass from '$lib/utils/merge';
	import Proxy from './Proxy.svelte';

	type Props = {
		children?: Snippet;
		class?: string;
		as?: Snippet<[any]>;
	} & VariantProps<typeof cardCVA>;

	const { children, as, color, class: className }: Props = $props();

	const cardCVA = cva('rounded-3xl border border-zinc-900 p-4', {
		variants: {
			color: {
				white: 'bg-white',
				yellow: 'bg-tertiary-1',
				green: 'bg-tertiary-2',
			},
		},
		defaultVariants: {
			color: 'white',
		},
	});

	const modifiedProps = {
		class: mergeClass(cardCVA({ color, className })),
	};
</script>

<Proxy {as} {...modifiedProps}>
	{#snippet fallback()}
		<section {...modifiedProps}>
			{@render children?.()}
		</section>
	{/snippet}

	{@render children?.()}
</Proxy>
