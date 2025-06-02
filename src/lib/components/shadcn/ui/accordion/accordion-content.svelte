<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "$lib/components/shadcn/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.ContentProps> = $props();
</script>

<AccordionPrimitive.Content
	bind:ref
	data-slot="accordion-content"
	class={cn(
		"data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden border-t border-zinc-900",
		className
	)}
	{...restProps}
>
	<div class="p-4 pb-6 text-zinc-700 text-sm xl:text-base">
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
