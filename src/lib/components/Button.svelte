<script lang="ts">
	import type { VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cva } from 'class-variance-authority';

	import mergeClass from '$lib/utils/merge';
	import Proxy from './Proxy.svelte';

	type Props = {
		as?: Snippet<[any]>;
	} & SvelteHTMLElements['button'] &
		VariantProps<typeof buttonCVA>;

	const { children, as, variant, size, class: className, ...props }: Props = $props();

	const buttonCVA = cva(
		'flex w-fit items-center justify-center gap-2 rounded-full font-medium disabled:cursor-not-allowed',
		{
			variants: {
				variant: {
					primary:
						'bg-zinc-800 text-white disabled:text-zinc-200 disabled:bg-zinc-600 hover:bg-zinc-950',
					secondary:
						'bg-white border border-zinc-800 hover:border-zinc-950 disabled:border-zinc-600 disabled:text-zinc-600',
				},
				size: {
					icon: 'p-1.5',
					sm: 'text-sm px-2 py-1.5',
					md: 'text-base px-3 py-2',
					lg: 'text-lg px-4 py-2.5',
				},
			},
			defaultVariants: {
				variant: 'primary',
				size: 'md',
			},
		},
	);

	const modifiedProps = $derived({
		...props,
		class: mergeClass(buttonCVA({ variant, size }), className),
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
