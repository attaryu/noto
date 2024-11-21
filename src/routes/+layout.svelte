<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head';
	import { pwaInfo } from 'virtual:pwa-info';

	import '../app.css';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let ReloadPrompt: Component | null = $state(null);
	let webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	onMount(async () => {
		ReloadPrompt = (await import('$lib/components/ReloadPrompt.svelte')).default;
	});
</script>

<svelte:head>
	{#if pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}

	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}

	{@html webManifest}
</svelte:head>

{@render children?.()}

{#if ReloadPrompt}
	<ReloadPrompt />
{/if}
