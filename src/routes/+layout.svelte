<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
// import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { onMount } from 'svelte';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head';
	import { pwaInfo } from 'virtual:pwa-info';

	import '../app.css';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let ReloadPrompt: Component | null = $state(null);
	let webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	});

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

<QueryClientProvider client={queryClient}>
	{@render children?.()}

	<!-- <SvelteQueryDevtools buttonPosition="bottom-left" /> -->
</QueryClientProvider>

{#if ReloadPrompt}
	<ReloadPrompt />
{/if}
