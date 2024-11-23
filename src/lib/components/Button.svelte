<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import { cva } from 'class-variance-authority';

	import mergeClass from '$lib/utils/merge';
	import Proxy from './Proxy.svelte';

	type Props = {
		as?: Snippet;
	} & SvelteHTMLElements['button'] &
		VariantProps<typeof buttonCVA>;

	const { children, as, variant, class: className, ...props }: Props = $props();

	const buttonCVA = cva(
		'flex w-fit items-center justify-center gap-2 rounded-full p-3 font-medium',
		{
			variants: {
				variant: {
					primary: 'bg-neutral-900 text-white',
					secondary: 'border border-neutral-900',
				},
			},
			defaultVariants: {
				variant: 'primary',
			},
		},
	);

	const modifiedProps = {
		...props,
		class: mergeClass(buttonCVA({ variant, className })),
	};
</script>

<Proxy {as} {...modifiedProps}>
	{#snippet fallback()}
		<button {...modifiedProps}>
			{@render children?.()}
		</button>
	{/snippet}

	{@render children?.()}
</Proxy>
