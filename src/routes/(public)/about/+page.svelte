<script lang="ts">
	import { m } from 'paraglide/messages';
	import { Toc } from '@svelte-put/toc';

	import Text from '$lib/components/Text.svelte';

	import { pageTitle } from '$lib/utils/pageTitle';
	import TableOfContent from './TableOfContent.svelte';

	const toc = new Toc({
		observe: true,
		scrollMarginTop: '25vh',
	});
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
			use:toc.actions.root
			class="overlapping-by-footer -mt-8 rounded-t-3xl border border-zinc-900 bg-white px-4 pt-12 md:grid md:grid-cols-[2fr_1fr] md:gap-8 md:rounded-t-[48px] md:px-16 md:pt-16 lg:grid-cols-[3fr_1fr] lg:px-24 xl:gap-12 xl:rounded-t-[64px] xl:pt-24"
		>
			<div class="space-y-8 pb-12 md:pb-16 xl:pb-24">
				<!-- 1 -->
				<section>
					<Text tag="h2" class="mb-3 leading-tight">
						{m['about_page.content_1.title']()}
					</Text>

					<Text class="mb-2 leading-relaxed">
						{m['about_page.content_1.texts.1']()}
					</Text>

					<Text class="leading-relaxed">
						{m['about_page.content_1.texts.2']()}
					</Text>
				</section>

				<!-- 2 -->
				<section>
					<Text tag="h2" class="mb-3 leading-tight">
						{m['about_page.content_2.title']()}
					</Text>

					<Text class="mb-2 leading-relaxed">
						{m['about_page.content_2.texts.1']()}
					</Text>

					<Text class="leading-relaxed">
						{m['about_page.content_2.texts.2']()}
					</Text>
				</section>

				<!-- 3 -->
				<section>
					<Text tag="h2" class="mb-3 leading-tight">
						{m['about_page.content_3.title']()}
					</Text>

					<Text class="mb-2 leading-relaxed">
						{m['about_page.content_3.texts.1']()}
					</Text>

					<ul class="list-inside list-disc space-y-2 pl-3">
						{@render li(m['about_page.content_3.texts.2.a']())}
						{@render li(m['about_page.content_3.texts.2.b']())}
						{@render li(m['about_page.content_3.texts.2.c']())}
					</ul>
				</section>

				<!-- 4 -->
				<section>
					<Text tag="h2" class="mb-3 leading-tight">
						{m['about_page.content_4.title']()}
					</Text>

					<Text class="mb-2 leading-relaxed">
						{m['about_page.content_4.texts.1']()}
					</Text>

					<ul class="mb-2 list-inside list-disc space-y-2 pl-3">
						{@render li(m['about_page.content_4.texts.2.a']())}
						{@render li(m['about_page.content_4.texts.2.b']())}
						{@render li(m['about_page.content_4.texts.2.c']())}
						{@render li(m['about_page.content_4.texts.2.d']())}
						{@render li(m['about_page.content_4.texts.2.e']())}
						{@render li(m['about_page.content_4.texts.2.f']())}
						{@render li(m['about_page.content_4.texts.2.g']())}
						{@render li(m['about_page.content_4.texts.2.h']())}
						{@render li(m['about_page.content_4.texts.2.i']())}
						{@render li(m['about_page.content_4.texts.2.j']())}
					</ul>

					<Text class="leading-relaxed">
						{m['about_page.content_4.texts.3']()}
					</Text>
				</section>

				<!-- 5 -->
				<section>
					<Text tag="h2" class="mb-3 leading-tight">
						{m['about_page.content_5.title']()}
					</Text>

					<Text class="mb-2 leading-relaxed">
						{m['about_page.content_5.texts.1']()}
					</Text>
				</section>

				<!-- 6 -->
				<section>
					<Text tag="h2" class="mb-3 leading-tight">
						{m['about_page.content_6.title']()}
					</Text>

					<Text class="mb-2 leading-relaxed">
						{m['about_page.content_6.texts.1']()}
					</Text>

					<Text class="mb-2 leading-relaxed">
						{m['about_page.content_6.texts.2']()}
					</Text>
				</section>
			</div>

			<div class="pb-12 md:pb-16 xl:pb-24">
				<div class="md:sticky md:top-32">
					<TableOfContent {toc} />
				</div>
			</div>
		</div>
	</article>
</main>

{#snippet li(text: string)}
	<li class="ml-5 -indent-5 text-zinc-700">
		{text}
	</li>
{/snippet}
