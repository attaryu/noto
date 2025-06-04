<script lang="ts">
	import { m } from 'paraglide/messages';

	import Text from '$lib/components/Text.svelte';
</script>

<footer
	class="space-y-10 rounded-t-4xl bg-zinc-900 px-4 py-8 md:space-y-14 md:rounded-t-[48px] md:px-16 md:pt-16 lg:px-24 xl:rounded-t-[64px] xl:pt-20 -mt-8 md:-mt-12 xl:-mt-16"
>
	<div class="flex gap-4 md:justify-between">
		<div class="md:w-3/4 xl:w-1/2">
			<!-- logo -->
			<div class="flex items-end gap-2 xl:gap-4">
				<div class="size-12 rounded-lg bg-white p-2.5 xl:size-20 xl:p-4">
					<img src="/logo/dark.svg" alt="" />
				</div>

				<Text styling="h1" class="leading-none font-bold text-white xl:text-6xl">Noto</Text>
			</div>

			<!-- short description -->
			<Text class="mt-4 mb-6 leading-tight text-white xl:text-lg">
				{m['home_page.hero.description']()}
			</Text>

			<!-- link -->
			<ul class="flex max-w-1/2 justify-between gap-6 text-white">
				{@render link(m['common.landing_page_links.home'](), '/')}
				{@render link(m['common.landing_page_links.app'](), '/app')}
				{@render link(m['common.landing_page_links.about'](), '/about')}
				{@render link(m['common.landing_page_links.faq'](), '/faq')}

				{#snippet link(text: string, href: string)}
					<li><a {href} class="hover:underline xl:text-lg">{text}</a></li>
				{/snippet}
			</ul>
		</div>

		<a
			href="https://github.com/attaryu/noto"
			target="_blank"
			class="size-8 shrink-0 rounded-md bg-white p-1 xl:size-12 xl:p-1.5"
		>
			<img src="/svg/github.svg" alt="" class="w-full" />
		</a>
	</div>

	<!-- footnote -->
	<div class="space-y-2 border-t border-white pt-4 md:flex md:items-center md:justify-between">
		<a href="/#" class="block text-sm text-white underline md:order-1">
			{m['settings_page.other_menu.item.privacy_policy']()}
		</a>

		<Text styling="small" class="text-white">© 2025 M Attar. All rights reserved.</Text>
	</div>
</footer>
