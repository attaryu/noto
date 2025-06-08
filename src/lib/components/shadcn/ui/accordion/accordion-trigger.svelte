<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import { cn, type WithoutChild } from '$lib/components/shadcn/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps['level'];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		data-slot="accordion-trigger"
		bind:ref
		class={cn(
			'focus-visible:border-ring focus-visible:ring-ring [&[data-state=open]]:bg-tertiary-1 flex flex-1 cursor-pointer items-start justify-between gap-4 p-4 text-left text-sm transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xl:text-base [&[data-state=open]>svg]:rotate-180',
			className,
		)}
		{...restProps}
	>
		{@render children?.()}
		<ArrowDown
			class="pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
		/>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
