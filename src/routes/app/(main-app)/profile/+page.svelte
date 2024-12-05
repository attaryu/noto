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

	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Header from '$lib/components/Header.svelte';
	import PreferenceItem from '$lib/components/Profile/PreferenceItem.svelte';
	import Select from '$lib/components/Select.svelte';
	import Text from '$lib/components/Text.svelte';
	import { goto } from '$app/navigation';

	const user = {
		fullname: 'John Doe',
		email: 'johndoe@gmail.com',
		image:
			'https://images.unsplash.com/photo-1601887389937-0b02c26b602c?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	};
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
				<Pen size={24} />
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
						<PreferenceItem text="Backup" action={() => goto('/app/backup')}>
							{#snippet icon()}
								<CloudUpload />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</PreferenceItem>
					</li>

					<li>
						<PreferenceItem text="Theme">
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
						</PreferenceItem>
					</li>

					<li>
						<PreferenceItem text="Language">
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
						</PreferenceItem>
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
						<PreferenceItem text="Privacy and Policy">
							{#snippet icon()}
								<Shield />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</PreferenceItem>
					</li>
					<li>
						<PreferenceItem text="Support">
							{#snippet icon()}
								<HeartHandshake />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</PreferenceItem>
					</li>
					<li>
						<PreferenceItem text="About">
							{#snippet icon()}
								<Info />
							{/snippet}
							{#snippet rightElement()}
								<ArrowRight />
							{/snippet}
						</PreferenceItem>
					</li>
				</ul>
			{/snippet}
		</Card>
	</section>
</main>

<Decorator color="green" class="-left-0 -top-8" />
<Decorator color="yellow" class="-right-1/2 top-1/4" size="large" />
<Decorator color="yellow" class="-left-1/2 top-1/2" size="large" />
