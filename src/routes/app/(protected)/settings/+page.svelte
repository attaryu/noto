<script lang="ts">
	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';

	import Info from '@lucide/svelte/icons/info';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CircleUserRound from '@lucide/svelte/icons/circle-user-round';
	import CloudUpload from '@lucide/svelte/icons/cloud-upload';
	import Globe from '@lucide/svelte/icons/globe';
	import Key from '@lucide/svelte/icons/key';
	import Shield from '@lucide/svelte/icons/shield';

	import { m } from 'paraglide/messages';
	import { getLocale, setLocale } from 'paraglide/runtime';

	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Header from '$lib/components/Header.svelte';
	import MenuItem from '$lib/components/Profile/MenuItem.svelte';
	import Text from '$lib/components/Text.svelte';
	import * as Select from '$lib/components/shadcn/ui/select';
	import Button from '$lib/components/Button.svelte';

	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';

	const availableLanguage = [
		{
			label: m['settings_page.interface_menu.item.language_value.en'](),
			value: 'en',
		},
		{
			label: m['settings_page.interface_menu.item.language_value.id'](),
			value: 'id',
		},
	];

	let language = $state(getLocale());

	const triggerContent = $derived(
		availableLanguage.find(({ value }) => value === language)?.label ?? 'Select a language',
	);

	$effect(() => {
		if (language !== getLocale()) {
			setLocale(language);
		}
	});

	const signOutMutation = createMutation({
		mutationFn: async () => axiosFetch.DELETE('/auth/sign-out'),
		onSettled: async () => {
			await secretKeyManagement.removeSecretKey();
			goto('/app/sign-in');
		},
	});
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<main class="flex flex-col gap-8 px-4 pt-24 pb-24">
	<Header class="border border-zinc-900 bg-white py-3">
		<Text tag="p" styling="h3">{m['settings_page.title']()}</Text>
	</Header>

	<!-- data settings -->
	<section class="space-y-2">
		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem
							type="link"
							text={m['settings_page.main_menu.item.account']()}
							action="/app/settings/account"
						>
							{#snippet icon()}
								<CircleUserRound />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem
							type="link"
							text={m['settings_page.main_menu.item.backup']()}
							action="/app/settings/backup"
						>
							{#snippet icon()}
								<CloudUpload />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem
							type="link"
							text={m['settings_page.main_menu.item.account_recovery']()}
							action="/app/account-recovery/step-1"
						>
							{#snippet icon()}
								<Key />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>
				</ul>
			{/snippet}
		</Card>
	</section>

	<!-- interface settings -->
	<section class="space-y-2">
		<Text tag="h2">
			{m['settings_page.interface_menu.title']()}
		</Text>

		<Card color="yellow" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<!-- <li>
						<MenuItem type="container" text="Theme">
							{#snippet icon()}
								<SunMoon />
							{/snippet}

							{#snippet rightElement()}
								<Select
									items={[
										{
											title: 'System',
											value: 'system',
										},
										{
											title: 'Light',
											value: 'light',
										},
										{
											title: 'Dark',
											value: 'dark',
										},
									]}
									selected={{
										title: 'System',
										value: 'system',
									}}
								/>
							{/snippet}
						</MenuItem>
					</li> -->

					<li>
						<MenuItem type="container" text={m['settings_page.interface_menu.item.language']()}>
							{#snippet icon()}
								<Globe />
							{/snippet}

							{#snippet rightElement()}
								<Select.Root type="single" bind:value={language}>
									<Button size="sm" class="px-3">
										{#snippet as(props)}
											<Select.Trigger {...props}>
												{triggerContent}
											</Select.Trigger>
										{/snippet}
									</Button>

									<Select.Content class="bg-zinc-800 rounded-xl">
										<Select.Group>
											<Select.Label class="text-zinc-400">
												{m['settings_page.interface_menu.item.language']()}
											</Select.Label>

											{#each availableLanguage as language (language.value)}
												<Select.Item
													value={language.value}
													label={language.label}
													class="text-zinc-200 data-[highlighted]:bg-zinc-700 data-[highlighted]:text-white rounded-lg"
												>
													{language.label}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</MenuItem>
					</li>
				</ul>
			{/snippet}
		</Card>
	</section>

	<!-- other section -->
	<section class="space-y-2">
		<Text tag="h2">
			{m['settings_page.other_menu.title']()}
		</Text>

		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem
							type="link"
							action="/privacy-policy"
							text={m['common.landing_page_links.privacy_policy']()}
						>
							{#snippet icon()}
								<Shield />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem type="link" action="/about" text={m['common.landing_page_links.about']()}>
							{#snippet icon()}
								<Info />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>
				</ul>
			{/snippet}
		</Card>
	</section>

	<Card color="white" class="bg-zinc-200 p-2">
		{#snippet as(props)}
			<ul {...props}>
				<li>
					<MenuItem
						type="button"
						text={m['settings_page.sign_out']()}
						action={$signOutMutation.mutate}
						disabled={$signOutMutation.isPending}
					/>
				</li>
			</ul>
		{/snippet}
	</Card>
</main>
