<script lang="ts">
	import { m } from 'paraglide/messages';

	import PlainTextView from '$lib/components/PlainTextView.svelte';
	import Text from '$lib/components/Text.svelte';

	import { pageTitle } from '$lib/utils/pageTitle';
</script>

<svelte:head>
	<title>{pageTitle(m['common.landing_page_links.about']())}</title>
</svelte:head>

<main class="overlapping-by-navbar from-tertiary-1 to-tertiary-2 bg-gradient-to-tr">
	<article>
		<!-- cover -->
		<section
			class="flex h-dvh max-h-[400px] flex-col justify-center gap-4 px-4 py-12 md:items-center md:p-16 lg:px-24 xl:py-24"
		>
			<Text tag="h1" class="font-bold">
				{m['about_page.title']()}
			</Text>

			<Text class="leading-normal">
				{m['about_page.description']()}
			</Text>
		</section>

		<!-- content -->
		<div
			class="overlapping-by-footer -mt-8 rounded-t-3xl border border-zinc-900 bg-white md:rounded-t-[48px] lg:grid-cols-[3fr_1fr] xl:rounded-t-[64px]"
		>
			<PlainTextView
				class="px-4 pt-12 md:p-16 lg:px-24 xl:pt-24"
				propertyRoot="about_page"
			/>
		</div>
	</article>
</main>
