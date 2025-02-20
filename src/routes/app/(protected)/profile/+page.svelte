<script lang="ts">
	import {
		ArrowRight,
		CloudUpload,
		Globe,
		HeartHandshake,
		Info,
		Pen,
		Shield,
		SunMoon,
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Header from '$lib/components/Header.svelte';
	import MenuItem from '$lib/components/Profile/MenuItem.svelte';
	import Select from '$lib/components/Select.svelte';
	import Text from '$lib/components/Text.svelte';

	import { getUserStore } from '$lib/stores/user.svelte';
	import { profileController } from './Controller.svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { axiosFetch } from '$lib/stores/api/baseConfig';

	const controller = profileController();
	const user = getUserStore();
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<main class="flex flex-col gap-8 px-4 pb-24 pt-56">
	<Header class="border border-zinc-900 bg-white p-3">
		<Text tag="p" class="text-center font-medium text-xl text-zinc-900">Profile</Text>
	</Header>

	<!--? profile section -->
	<Card color="green">
		<div class="relative mx-auto w-fit">
			<img
				src={user.image}
				alt="{user.fullname}'s photo"
				class="-mt-28 size-40 rounded-full border border-zinc-900 object-cover"
			/>

			<Button class="absolute bottom-0 right-0 border border-tertiary-2">
				<Pen size={20} />
			</Button>
		</div>

		<div class="mx-auto mt-6 flex w-fit flex-col items-center gap-2">
			<Text tag="h1" class="px-4 text-3xl">{user.fullname}</Text>
			<hr class="w-full border-zinc-500" />
			<Text tag="small" class="px-4">{user.email}</Text>
		</div>
	</Card>

	<!--? preference section -->
	<section class="space-y-2">
		<Text tag="h2">Preferences</Text>

		<Card color="yellow" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem text="Backup" action={() => goto('/app/backup')}>
							{#snippet icon()}
								<CloudUpload />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>

					<li>
						<MenuItem text="Theme">
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
						<MenuItem text="Language">
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

	<!--? other section -->
	<section class="space-y-2">
		<Text tag="h2">Other</Text>

		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem text="Privacy and Policy">
							{#snippet icon()}
								<Shield />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>
					<li>
						<MenuItem text="Support">
							{#snippet icon()}
								<HeartHandshake />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</MenuItem>
					</li>
					<li>
						<MenuItem text="About">
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
						text="Logout"
						action={controller.logOutMutation.mutate}
						disabled={controller.logOutMutation.isPending}
					/>
				</li>
			</ul>
		{/snippet}
	</Card>
</main>

<Decorator color="green" class="-left-0 -top-8" />
<Decorator color="yellow" class="-right-1/2 top-1/4" size="large" />
<Decorator color="yellow" class="-left-1/2 top-1/2" size="large" />
