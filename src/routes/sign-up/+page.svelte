<script lang="ts">
	import Mail from 'lucide-svelte/icons/mail';
	import MoveRight from 'lucide-svelte/icons/move-right';

	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Text from '$lib/components/Text.svelte';

	const formId = 'sign-up';
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<main class="flex h-screen flex-col p-4">
	<header class="flex justify-end">
		<Button variant="secondary" class="py-2">
			{#snippet as(props?: any)}
				<a href="/" {...props}>
					Skip <MoveRight />
				</a>
			{/snippet}
		</Button>
	</header>

	<form action="" method="post" id={formId} class="flex h-full flex-col">
		<div class="flex h-full flex-col items-center justify-center">
			<Text tag="h1" class="text-center">Welcome note taker!</Text>

			<Text class="mt-2 text-center">
				Register and access notes from anywhere! Or skip it and save the notes in local storage.
			</Text>

			<div class="mt-8 space-y-4">
				<Input type="fullname" placeholder="Fullname" name="fullname" class="w-full" />
				<Input type="email" placeholder="Email" name="email" class="w-full" />
				<Input type="password" placeholder="Password" name="password" class="w-full" />
				<Input
					type="password"
					placeholder="Confirm Password"
					name="confirm-password"
					class="w-full"
				/>
			</div>

			<Text tag="small" class="mt-8 text-center">
				Already have an account? <a href="/sign-in" class="text-sky-500">Sign in now!</a>
			</Text>
		</div>
	</form>

	<Button form={formId} type="submit" class="w-full">
		<Mail /> Sign Up
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
