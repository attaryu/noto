<script lang="ts">
	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import {
		ArrowRight,
		CircleUserRound,
		CloudUpload,
		Globe,
		Info,
		Key,
		Shield,
	} from 'lucide-svelte';
	import { m } from 'paraglide/messages';
	import { getLocale, setLocale } from 'paraglide/runtime';

	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Header from '$lib/components/Header.svelte';
	import MenuItem from '$lib/components/Profile/MenuItem.svelte';
	import Select from '$lib/components/Select.svelte';
	import Text from '$lib/components/Text.svelte';

	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';

	let language = $state(getLocale());

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

<main class="flex flex-col gap-8 px-4 pb-24 pt-24">
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
								<Select
									items={[
										{
											title: m['settings_page.interface_menu.item.language_value.en'](),
											value: 'en',
										},
										{
											title: m['settings_page.interface_menu.item.language_value.id'](),
											value: 'id',
										},
									]}
									bind:selected={language}
								/>
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
						<MenuItem type="container" text={m['settings_page.other_menu.item.privacy_policy']()}>
							{#snippet icon()}
								<Shield />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<!-- <li>
						<MenuItem type="container" text="Support">
							{#snippet icon()}
								<HeartHandshake />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li> -->

					<li>
						<MenuItem type="container" text={m['settings_page.other_menu.item.about']()}>
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

<Decorator color="green" class="-left-0 -top-8" />
<Decorator color="yellow" class="-right-1/2 top-1/4" size="large" />
<Decorator color="yellow" class="-left-1/2 top-1/2" size="large" />
