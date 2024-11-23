<script lang="ts">
	import Mail from 'lucide-svelte/icons/mail';
	import MoveLeft from 'lucide-svelte/icons/move-left';

	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Text from '$lib/components/Text.svelte';

	const formId = 'sign-in';
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<main class="flex h-screen flex-col p-4">
	<header>
		<Button>
			{#snippet as(props?: any)}
				<a href="/sign-up" {...props}>
					<MoveLeft />
				</a>
			{/snippet}
		</Button>
	</header>

	<form action="" method="post" id={formId} class="flex h-full flex-col">
		<div class="flex h-full flex-col items-center justify-center">
			<Text tag="h1" class="text-center">Welcome back!</Text>

			<Text class="mt-2 text-center">I'm glad you're back! It's your time to note everything</Text>

			<div class="mt-8 space-y-4">
				<Input type="email" placeholder="Email" name="email" class="w-full" />
				<Input type="password" placeholder="Password" name="password" class="w-full" />
			</div>

			<Text tag="small" class="mt-8 text-center">
				Don't have an account? <a href="/sign-up" class="text-sky-500">Sign up now!</a>
			</Text>
		</div>
	</form>

	<Button form={formId} type="submit" class="w-full">
		<Mail /> Sign In
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
