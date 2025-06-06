<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import { page } from '$app/state';
	import { m } from 'paraglide/messages';

	import Text from '$lib/components/Text.svelte';
	import Button from '$lib/components/Button.svelte';
	import * as DropdownMenu from '$lib/components/shadcn/ui/dropdown-menu';
</script>

<!-- 2xl:w-7xl same as content container width -->
<div class="fixed inset-x-0 top-0 z-50 mx-auto w-full p-4 md:px-16 lg:px-24 2xl:w-7xl">
	<!-- navbar -->
	<nav
		class="flex items-center justify-between gap-2 rounded-full border border-zinc-900 bg-white p-2.5 shadow-md md:grid md:grid-cols-[1fr_2fr_1fr] md:rounded-2xl"
	>
		<!-- logo -->
		<div class="flex items-center gap-2">
			<div class="rounded-full bg-zinc-900 p-2.5 md:rounded-lg md:p-2">
				<img src="/logo/light.svg" alt="" class="size-4 md:size-6" />
			</div>

			<Text styling="h2" class="font-bold xl:text-3xl">Noto</Text>
		</div>

		<!-- medium or larger screen navigation -->
		<ul
			class="invisible hidden items-center gap-4 md:visible md:flex md:justify-self-center xl:gap-8"
		>
			{@render wideViewLink(m['common.landing_page_links.home'](), '/')}
			{@render wideViewLink(m['common.landing_page_links.app'](), '/app')}
			{@render wideViewLink(m['common.landing_page_links.about'](), '/about')}
			{@render wideViewLink(m['common.landing_page_links.faq'](), '/faq')}

			{#snippet wideViewLink(title: string, href: string)}
				<li>
					<a {href} class:underline={page.url.pathname === href} class="text-nowrap">
						{title}
					</a>
				</li>
			{/snippet}
		</ul>

		<div class="flex gap-2 md:justify-self-end">
			<Button class="md:rounded-lg">
				{#snippet as(props: any)}
					<a href="/app/sign-in" {...props}>
						{m['sign_in_page.form.submit']()}
					</a>
				{/snippet}
			</Button>

			<!-- small screen navigation -->
			<DropdownMenu.Root>
				<!-- just need hidden the trigger button -->
				<Button size="icon" variant="secondary" class="md:invisible md:hidden">
					{#snippet as(props: any)}
						<DropdownMenu.Trigger {...props}>
							<Menu />
						</DropdownMenu.Trigger>
					{/snippet}
				</Button>

				<DropdownMenu.Content align="end" class="rounded-xl border border-zinc-500">
					{@render smallViewLink(m['common.landing_page_links.home'](), '/')}
					{@render smallViewLink(m['common.landing_page_links.app'](), '/app')}
					{@render smallViewLink(m['common.landing_page_links.about'](), '/about')}
					{@render smallViewLink(m['common.landing_page_links.faq'](), '/faq')}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			{#snippet smallViewLink(title: string, href: string)}
				<DropdownMenu.Item class="rounded-lg">
					<a {href} class:underline={page.url.pathname === href}>{title}</a>
				</DropdownMenu.Item>
			{/snippet}
		</div>
	</nav>
</div>
