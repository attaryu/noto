<script lang="ts">
	import { m } from 'paraglide/messages';

	import Text from '$lib/components/Text.svelte';
	import PlainTextView from '$lib/components/PlainTextView.svelte';

	import { pageTitle } from '$lib/utils/pageTitle';
</script>

<svelte:head>
	<title>{pageTitle(m['common.landing_page_links.privacy_policy']())}</title>
</svelte:head>

<main class="overlapping-by-navbar overlapping-by-footer">
	<section class="space-y-4 px-4 py-12 md:p-16 lg:px-24 xl:p-24">
		<Text tag="h1">{m['privacy_policy_page.title']()}</Text>

		<Text>{m['privacy_policy_page.description']()}</Text>

		<div class="space-y-1">
			<Text tag="small">
				{m['privacy_policy_page.metadata.last_updated']({ date: '10/06/2025' })}
			</Text>

			<Text tag="small">
				{m['privacy_policy_page.metadata.last_version']({ version: '0.1' })}
			</Text>
		</div>
	</section>

	<PlainTextView
		class="px-4 pb-12 md:px-16 md:pb-16 lg:px-24 xl:pb-24"
		propertyRoot="privacy_policy_page"
	/>
</main>
<!-- px-4 pt-12 md:px-16 md:pt-16 lg:px-24 xl:pt-24 -->
<!-- pb-12 md:pb-16 xl:pb-24 -->
