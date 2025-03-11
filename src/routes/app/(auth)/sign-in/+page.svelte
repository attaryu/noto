<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Mail from 'lucide-svelte/icons/mail';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';
	import { signInController } from './Controller.svelte';

	const formId = 'sign-in';

	const controller = signInController();
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

		<form id={formId} class="mt-8 w-full space-y-2" onsubmit={controller.submitHandler}>
			<Input
				type="email"
				placeholder="Email"
				name="email"
				class="w-full"
				value={controller.form.fields.email}
				oninput={({ currentTarget }) => (controller.form.fields.email = currentTarget.value ?? '')}
			/>

			<FieldError>{controller.emailErrorMessage}</FieldError>

			<Input
				type="password"
				placeholder="Password"
				name="password"
				class="w-full"
				bind:value={controller.form.fields.password}
			/>

			<FieldError>{controller.form.errors?.password}</FieldError>
		</form>

		<Text tag="small" class="mt-8">
			Forgot your password? <a href="/app/account-recovery/step-1" class="text-sky-500"
				>Recover here</a
			>
		</Text>

		<Text tag="small" class="mt-4">
			Don't have an account? <a href="/app/sign-up" class="text-sky-500">Sign up now!</a>
		</Text>
	</div>

	<Button
		form={formId}
		type="submit"
		class="mt-auto w-full"
		disabled={controller.signinMutation.isPending || !controller.form.isValid}
	>
		{#if controller.signinMutation.isPending}
			Loading...
		{:else}
			<Mail /> Sign In
		{/if}
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
