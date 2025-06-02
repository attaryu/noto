<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn } from '../../utils';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: AccordionPrimitive.RootProps = $props();
</script>

<AccordionPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="accordion"
	class={cn("border border-zinc-900 rounded-xl overflow-hidden", className)}
	{...restProps}
/>
