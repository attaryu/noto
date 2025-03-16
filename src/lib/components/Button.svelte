<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import { cva } from 'class-variance-authority';

	import mergeClass from '$lib/utils/merge';
	import Proxy from './Proxy.svelte';

	type Props = {
		as?: Snippet<[any]>;
	} & SvelteHTMLElements['button'] &
		VariantProps<typeof buttonCVA>;

	const { children, as, variant, class: className, ...props }: Props = $props();

	const buttonCVA = cva(
		'flex w-fit items-center justify-center gap-2 rounded-full p-3 font-medium',
		{
			variants: {
				variant: {
					primary: 'bg-zinc-900 text-white disabled:text-zinc-500 disabled:bg-zinc-800',
					secondary:
						'bg-white border border-zinc-900 disabled:border-zinc-400 disabled:text-zinc-400',
				},
			},
			defaultVariants: {
				variant: 'primary',
			},
		},
	);

	const modifiedProps = $derived({
		...props,
		class: mergeClass(buttonCVA({ variant }), className),
	});
</script>

<Proxy {as} {...modifiedProps}>
	{#snippet fallback()}
		<button {...modifiedProps}>
			{@render children?.()}
		</button>
	{/snippet}

	{@render children?.()}
</Proxy>
