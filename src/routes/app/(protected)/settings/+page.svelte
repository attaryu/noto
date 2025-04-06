<script lang="ts">
	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import {
		ArrowRight,
		CircleUserRound,
		CloudUpload,
		Globe,
		HeartHandshake,
		Info,
		Key,
		Shield,
		SunMoon,
	} from 'lucide-svelte';

	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Header from '$lib/components/Header.svelte';
	import MenuItem from '$lib/components/Profile/MenuItem.svelte';
	import Select from '$lib/components/Select.svelte';
	import Text from '$lib/components/Text.svelte';

	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';

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
		<Text tag="p" styling="h3">Settings</Text>
	</Header>

	<!-- data settings -->
	<section class="space-y-2">
		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem type="link" text="Account" action="/app/settings/account">
							{#snippet icon()}
								<CircleUserRound />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem type="link" text="Backup" action="/app/settings/backup">
							{#snippet icon()}
								<CloudUpload />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem type="link" text="Account Recovery" action="/app/account-recovery/step-1">
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
		<Text tag="h2">Interface</Text>

		<Card color="yellow" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
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
					</li>

					<li>
						<MenuItem type="container" text="Language">
							{#snippet icon()}
								<Globe />
							{/snippet}

							{#snippet rightElement()}
								<Select
									items={[
										{
											title: 'English',
											value: 'en',
										},
										{
											title: 'Indonesia',
											value: 'id',
										},
									]}
									selected={{
										title: 'English',
										value: 'en',
									}}
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
		<Text tag="h2">Other</Text>

		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem type="container" text="Privacy and Policy">
							{#snippet icon()}
								<Shield />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem type="container" text="Support">
							{#snippet icon()}
								<HeartHandshake />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem type="container" text="About">
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
						text="Logout"
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
