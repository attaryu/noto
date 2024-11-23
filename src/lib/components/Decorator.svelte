<script lang="ts">
	import mergeClass from '$lib/utils/merge';
	import { cva, type VariantProps } from 'class-variance-authority';

	type Props = {
		class: string;
	} & VariantProps<typeof decoratorCVA>;

	const { color, size, class: className }: Props = $props();

	const decoratorCVA = cva(
		'pointer-events-none fixed -z-50 aspect-square rounded-full opacity-90 blur-3xl',
		{
			variants: {
				color: {
					yellow: 'bg-tertiary-1',
					green: 'bg-tertiary-2',
				},
				size: {
					normal: 'w-1/2',
					large: 'w-2/3',
				},
			},
			defaultVariants: {
				size: 'normal',
			},
		},
	);
</script>

<div class={mergeClass(decoratorCVA({ color, size, className }))}></div>
