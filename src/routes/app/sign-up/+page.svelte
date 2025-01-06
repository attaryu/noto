<script lang="ts">
	import Mail from 'lucide-svelte/icons/mail';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	const formId = 'sign-up';
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<main class="flex h-screen flex-col p-4">
	<header class="flex h-12 items-center">
		<Button variant="secondary" class="ml-auto py-2">
			{#snippet as(props?: any)}
				<a href="/app" {...props}>
					Skip <ArrowRight />
				</a>
			{/snippet}
		</Button>
	</header>

	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">Welcome note taker!</Text>

		<Text class="mt-4 text-center">
			Register and access notes from anywhere! Or skip it and save the notes in local storage.
		</Text>

		<form action="" method="post" id={formId} class="mt-8 space-y-2">
			<Input type="fullname" placeholder="Fullname" name="fullname" class="w-full" />
			<Input type="email" placeholder="Email" name="email" class="w-full" />
			<Input type="password" placeholder="Password" name="password" class="w-full" />
			<Input
				type="password"
				placeholder="Confirm Password"
				name="confirm-password"
				class="w-full"
			/>
		</form>

		<Text tag="small" class="mt-8">
			Already have an account? <a href="/app/sign-in" class="text-sky-500">Sign in now!</a>
		</Text>
	</div>

	<Button form={formId} type="submit" class="mt-auto w-full">
		<Mail /> Sign Up
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
