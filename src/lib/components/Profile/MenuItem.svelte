<script lang="ts">
	import type { Snippet } from 'svelte';

	interface LinkProps {
		type: 'link';
		text: string;
		action: string;
		icon?: Snippet;
		rightElement?: Snippet;
		disabled?: boolean;
	}

	interface ButtonProps {
		type: 'button';
		text: string;
		action: () => void;
		icon?: Snippet;
		rightElement?: Snippet;
		disabled?: boolean;
	}

	interface ContainerProps {
		type: 'container';
		text: string;
		action?: () => void;
		icon?: Snippet;
		rightElement?: Snippet;
		disabled?: boolean;
	}

	type Props = LinkProps | ButtonProps | ContainerProps;

	const { icon, text, rightElement, disabled, action, type }: Props = $props();

	const className = 'flex h-14 w-full items-center gap-4 px-4';
</script>

{#if type === 'link'}
	<a class={className} href={action} aria-disabled={disabled}>
		{@render icon?.()}

		<span class="text-lg">{text}</span>

		<span class="ml-auto">
			{@render rightElement?.()}
		</span>
	</a>
{:else if type === 'container'}
	<div class={className} aria-disabled={disabled}>
		{@render icon?.()}

		<span class="text-lg">{text}</span>

		<span class="ml-auto">
			{@render rightElement?.()}
		</span>
	</div>
{:else}
	<button class={className} onclick={action} {disabled}>
		{@render icon?.()}

		<span class="text-lg">{text}</span>

		<span class="ml-auto">
			{@render rightElement?.()}
		</span>
	</button>
{/if}
