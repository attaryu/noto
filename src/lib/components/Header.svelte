<script lang="ts">
	import type { VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cva } from 'class-variance-authority';

	import mergeClass from '$lib/utils/merge';

	type Props = SvelteHTMLElements['header'] & VariantProps<typeof headerCVA>;

	const { children, gradientColor, class: className, ...props }: Props = $props();

	const headerCVA = cva('fixed z-50 inset-x-0 top-0 p-4 bg-linear-to-b to-transparent', {
		variants: {
			gradientColor: {
				white: 'from-white',
				yellow: 'from-tertiary-1',
				green: 'from-tertiary-2',
			},
		},
		defaultVariants: {
			gradientColor: 'white',
		},
	});
</script>

<div class={mergeClass(headerCVA({ gradientColor }))}>
	<header
		class={mergeClass('flex min-h-12 max-w-[440px] mx-auto items-center justify-center rounded-full', className)}
		{...props}
	>
		{@render children?.()}
	</header>
</div>
