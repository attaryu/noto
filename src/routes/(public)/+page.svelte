<script lang="ts">
	import type { Icon as LucideIcon } from 'lucide-svelte';

	import { FileLock2, GalleryVerticalEnd, Heart, SquareActivity } from 'lucide-svelte';
	import { m } from 'paraglide/messages';

	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import * as Accordion from '$lib/components/shadcn/ui/accordion';
	import Text from '$lib/components/Text.svelte';

	import { pageTitle } from '$lib/utils/pageTitle';
	import mergeClass from '$lib/utils/merge';
</script>

<svelte:head>
	<title>{pageTitle(m['common.landing_page_links.home']())}</title>
</svelte:head>

<main class="overlapping-by-footer overlapping-by-navbar">
	<!-- hero -->
	<section
		class="flex flex-col items-center overflow-hidden px-4 py-8 md:flex-row md:gap-12 md:p-16 lg:justify-between lg:px-24 xl:pb-24"
	>
		<!-- content -->
		<div class="lg:w-[350px] lg:shrink-0 xl:w-1/2 xl:shrink">
			<Text tag="h1" class="font-bold xl:text-6xl">{m['home_page.hero.title']()}</Text>

			<Text class="mt-4 leading-normal xl:text-lg">{m['home_page.hero.description']()}</Text>

			<Button size="lg" class="mt-8">
				{#snippet as(props)}
					<a {...props} href="/app/sign-in">
						{m['home_page.cta']()}
					</a>
				{/snippet}
			</Button>
		</div>

		<!-- image -->
		<div
			class="relative my-20 flex aspect-square w-full items-center justify-center md:my-0 lg:w-[350px] lg:shrink-0 xl:size-[480px]"
		>
			<img src="/svg/hero-image.svg" alt="" class="absolute w-full -rotate-12" />

			<div
				class="bg-tertiary-2 -z-10 aspect-square w-[85%] -rotate-12 rounded-2xl border border-zinc-900"
			></div>
		</div>
	</section>

	<!-- key features -->
	<section
		class="bg-tertiary-1 border-t border-b border-zinc-900 px-4 py-12 md:p-16 lg:px-24 xl:py-24"
	>
		<Text tag="h2" class="md:text-center xl:text-3xl">{m['home_page.key_features.title']()}</Text>

		<ul
			class="mt-8 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-2 xl:mx-auto xl:mt-12 xl:w-4/5"
		>
			{@render keyFeature(
				m['home_page.key_features.items.1.title'](),
				m['home_page.key_features.items.1.description'](),
				Heart,
			)}

			{@render keyFeature(
				m['home_page.key_features.items.2.title'](),
				m['home_page.key_features.items.2.description'](),
				FileLock2,
			)}

			{@render keyFeature(
				m['home_page.key_features.items.3.title'](),
				m['home_page.key_features.items.3.description'](),
				GalleryVerticalEnd,
			)}

			{@render keyFeature(
				m['home_page.key_features.items.4.title'](),
				m['home_page.key_features.items.4.description'](),
				SquareActivity,
			)}

			{#snippet keyFeature(title: string, description: string, Icon: typeof LucideIcon)}
				<li
					class="flex items-center gap-4 rounded-2xl border border-zinc-900 bg-white p-4 shadow-md"
				>
					<div
						class="bg-tertiary-2 grid place-items-center rounded-xl border border-zinc-900 p-2.5"
					>
						<Icon class="size-6 xl:size-8" />
					</div>

					<div>
						<Text tag="h3" class="text-lg xl:text-xl">{title}</Text>
						<Text styling="small" class="xl:text-base">{description}</Text>
					</div>
				</li>
			{/snippet}
		</ul>
	</section>

	<!-- user benefits -->
	<section class="px-4 py-12 md:p-16 lg:px-24 xl:py-24">
		<Text tag="h2" class="text-center xl:text-3xl">{m['home_page.user_benefits.title']()}</Text>

		<ul
			class="mt-8 flex flex-col gap-6 md:grid md:auto-rows-auto md:grid-cols-[1.5fr_1fr] lg:grid-cols-3 xl:mt-12"
		>
			<!-- card 1 -->
			<Card
				color="green"
				class="flex flex-col items-center justify-between gap-4 p-6 shadow-lg md:items-start"
			>
				{#snippet as(props)}
					<li {...props}>
						<img src="/svg/top-secret-pana-tertiary-1.svg" alt="" class="w-2/3 md:w-1/2 lg:w-2/3" />

						<div class="space-y-2">
							{@render cardTitle({
								text: m['home_page.user_benefits.items.1.title'](),
								class: 'text-center md:text-start',
							})}

							{@render cardDescription({
								text: m['home_page.user_benefits.items.1.description'](),
								class: 'text-center md:text-start',
							})}
						</div>
					</li>
				{/snippet}
			</Card>

			<!-- card 2 -->
			<Card
				color="white"
				class="flex flex-col items-center justify-between gap-4 p-6 shadow-lg md:items-end lg:items-center"
			>
				{#snippet as(props)}
					<li {...props}>
						<img src="/svg/enthusiastic-pana-tertiary-2.svg" alt="" class="w-2/3" />

						<div class="space-y-2">
							{@render cardTitle({
								text: m['home_page.user_benefits.items.2.title'](),
								class: 'text-center md:text-end lg:text-center',
							})}

							{@render cardDescription({
								text: m['home_page.user_benefits.items.2.description'](),
								class: 'text-center md:text-end lg:text-center',
							})}
						</div>
					</li>
				{/snippet}
			</Card>

			<!-- card 3 -->
			<Card
				color="yellow"
				class="flex flex-col items-center justify-between gap-4 p-6 shadow-lg md:col-span-2 md:flex-row lg:col-start-3 lg:col-end-3 lg:flex-col lg:items-end"
			>
				{#snippet as(props)}
					<li {...props}>
						<img
							src="/svg/attached-files-pana-tertiary-2.svg"
							alt=""
							class="w-2/3 md:w-1/4 lg:w-2/3"
						/>

						<div class="space-y-2">
							{@render cardTitle({
								text: m['home_page.user_benefits.items.3.title'](),
								class: 'text-center md:text-start lg:text-end',
							})}

							{@render cardDescription({
								text: m['home_page.user_benefits.items.3.description'](),
								class: 'text-center md:text-start lg:text-end',
							})}
						</div>
					</li>
				{/snippet}
			</Card>

			{#snippet cardTitle(props: { text: string; class?: string })}
				<Text tag="h3" class={mergeClass('font-bold xl:text-2xl', props.class)}>
					{props.text}
				</Text>
			{/snippet}

			{#snippet cardDescription(props: { text: string; class?: string })}
				<Text styling="small" class={mergeClass('text-zinc-700 xl:text-base', props.class)}>
					{props.text}
				</Text>
			{/snippet}
		</ul>
	</section>

	<!-- source-available -->
	<section
		class="bg-tertiary-2 relative overflow-hidden border-t border-b border-zinc-900 px-4 pt-12 pb-32 md:p-16 lg:px-24 xl:py-24"
	>
		<div class="relative z-10 xl:w-2/3">
			<Text tag="h2" class="text-3xl xl:text-4xl ">
				{m['home_page.source_available.title']()}
			</Text>

			<Text styling="small" class="mt-4 text-black md:w-3/5 xl:text-base">
				{m['home_page.source_available.description']()}
			</Text>

			<Button class="mt-10">
				{#snippet as(props)}
					<a {...props} href="https://github.com/attaryu/noto" target="_blank">
						{m['home_page.source_available.cta']()}
					</a>
				{/snippet}
			</Button>
		</div>

		<!-- github logo -->
		<div
			class="absolute -right-12 -bottom-12 size-64 rotate-12 md:-right-24 md:size-[400px] xl:size-[500px]"
		>
			<div
				class="from-tertiary-2 to-tertiary-2/30 md:from-tertiary-2/90 absolute inset-0 bg-gradient-to-br md:bg-gradient-to-r"
			></div>

			<img src="/svg/github.svg" alt="" class="aspect-square w-full" />
		</div>
	</section>

	<!-- faq -->
	<section
		class="flex flex-col justify-between gap-8 px-4 py-12 md:flex-row md:p-16 lg:px-24 xl:py-24"
	>
		<div class="w-full">
			<Text tag="h2" class="xl:text-3xl">{m['home_page.faq.title']()}</Text>
			<Text class="mt-2">{m['home_page.faq.descriptiont']()}</Text>

			<!-- <Button>See more</Button> -->
		</div>

		<div class="w-full">
			<Accordion.Root type="single" class="w-full" value={m['home_page.faq.items.1.question']()}>
				{@render faqItem(
					m['home_page.faq.items.1.answer'](),
					m['home_page.faq.items.1.question'](),
				)}

				{@render faqItem(
					m['home_page.faq.items.2.answer'](),
					m['home_page.faq.items.2.question'](),
				)}

				{@render faqItem(
					m['home_page.faq.items.3.answer'](),
					m['home_page.faq.items.3.question'](),
				)}

				{@render faqItem(
					m['home_page.faq.items.4.answer'](),
					m['home_page.faq.items.4.question'](),
				)}
				{@render faqItem(
					m['home_page.faq.items.5.answer'](),
					m['home_page.faq.items.5.question'](),
				)}
			</Accordion.Root>

			{#snippet faqItem(answer: string, question: string)}
				<Accordion.Item value={question}>
					<Accordion.Trigger>{question}</Accordion.Trigger>

					<Accordion.Content>{answer}</Accordion.Content>
				</Accordion.Item>
			{/snippet}
		</div>
	</section>

	<!-- last offer -->
	<section class="px-4 pb-12 md:px-16 md:pb-16 lg:px-24 xl:pb-24">
		<Card
			color="yellow"
			class="h-[400px] overflow-hidden p-6 md:relative md:flex md:h-fit md:items-center md:p-8 xl:p-12"
		>
			<div class="flex flex-col gap-4 md:w-2/3 xl:gap-10">
				<Text tag="h2" class="xl:text-4xl">
					{m['home_page.last_offer.title.1']()}
					<br class="hidden md:inline" />
					{m['home_page.last_offer.title.2']()}
				</Text>

				<Button>
					{#snippet as(props)}
						<a {...props} href="/app/sign-in">
							{m['home_page.cta']()}
						</a>
					{/snippet}
				</Button>
			</div>

			<img
				src="/svg/good-team-pana-tertiary-2.svg"
				alt=""
				class="md:absolute md:top-0 md:-right-0 md:w-2/5 xl:w-2/6"
			/>
		</Card>
	</section>
</main>
