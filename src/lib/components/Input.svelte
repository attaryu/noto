<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import mergeClass from '$lib/utils/merge';

	type Props = {
		icon?: Snippet<[any]>;
	} & SvelteHTMLElements['input'];

	let { value = $bindable(), class: className, icon, onfocus, onblur, ...props }: Props = $props();

	let inputRef: HTMLInputElement;
	let isInputOnFocus: boolean = $state(false);

	const defaultClass = $derived(
		mergeClass(
			// ? default
			'w-fit border border-zinc-400 transition-colors duration-300 rounded-2xl p-3 outline-none bg-white invalid:border-red-300 invalid:focus:border-red-600',

			// ? apply input with icon
			icon && 'flex items-center gap-3',

			// ? focus state
			isInputOnFocus && 'border-zinc-900',

			// ? external class
			className,
		),
	);

	function onFocusHandler(e: EventParameter<FocusEvent, HTMLDivElement | HTMLInputElement>) {
		isInputOnFocus = true;
		inputRef.focus();
		onfocus?.(e as any);
	}

	function onBlurHandler(e: EventParameter<FocusEvent, HTMLInputElement>) {
		isInputOnFocus = false;
		onblur?.(e as any);
	}
</script>

{#if icon}
	<div class={defaultClass} onfocus={onFocusHandler}>
		{@render icon({
			class: `transition-opacity duration-300 ${!isInputOnFocus && 'opacity-30'}`,
			onfocus: onFocusHandler,
		})}

		{@render input({
			class: 'outline-none w-full',
			onblur: onBlurHandler,
			onfocus: onFocusHandler,
			...props,
		})}
	</div>
{:else}
	{@render input({
		class: defaultClass,
		onblur: onBlurHandler,
		onfocus: onFocusHandler,
		...props,
	})}
{/if}

<!-- ? act like independent component -->
<!-- ! don't touch it :D -->
{#snippet input(props: Omit<Props, 'icon'>)}
	<input bind:this={inputRef} bind:value {...props} />
{/snippet}
