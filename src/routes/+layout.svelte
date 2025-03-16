<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { onMount } from 'svelte';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head';
	import { pwaInfo } from 'virtual:pwa-info';

	import Text from '$lib/components/Text.svelte';

	import '../app.css';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let screenSize: null | number = $state(null);
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
		screenSize = window.innerWidth;
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
	{#if screenSize}
		{#if screenSize > 400}
			<main class="flex h-svh flex-col items-center justify-center gap-4">
				<Text tag="h1">Ups, something happened...</Text>
				<Text class="text-center">
					Sorry for the inconvenience. For now, our website only supports the mobile<br /> display. We
					will update in the future, so stay tune!
				</Text>
			</main>
		{:else}
			{@render children?.()}
		{/if}
	{/if}

	<SvelteQueryDevtools buttonPosition="bottom-left" />
</QueryClientProvider>

{#if ReloadPrompt}
	<ReloadPrompt />
{/if}
