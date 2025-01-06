<script lang="ts">
	import Mail from 'lucide-svelte/icons/mail';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	const formId = 'sign-in';
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<main class="flex h-screen flex-col p-4">
	<header class="flex h-12 items-center">
		<Button class="mr-auto">
			{#snippet as(props?: any)}
				<a href="/app/sign-up" {...props}>
					<ArrowLeft />
				</a>
			{/snippet}
		</Button>
	</header>

	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="mt-auto text-center">Welcome back!</Text>
		<Text class="mt-4 text-center">I'm glad you're back! It's your time to note everything</Text>

		<form action="" method="post" id={formId} class="mt-8 space-y-2">
			<Input type="email" placeholder="Email" name="email" class="w-full" />
			<Input type="password" placeholder="Password" name="password" class="w-full" />
		</form>

		<Text tag="small" class="mt-8">
			Don't have an account? <a href="/app/sign-up" class="text-sky-500">Sign up now!</a>
		</Text>
	</div>

	<Button form={formId} type="submit" class="mt-auto w-full">
		<Mail /> Sign In
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
