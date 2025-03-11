<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Mail from 'lucide-svelte/icons/mail';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';
	import { signUpController } from './Controller.svelte';

	const formId = 'sign-up';

	const controller = signUpController();
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
			Register and access notes from anywhere! Or skip it and save the notes in local.
		</Text>

		<form id={formId} class="mt-8 w-full space-y-2" onsubmit={controller.signUpHandler}>
			<Input
				type="fullname"
				placeholder="Fullname"
				name="fullname"
				bind:value={controller.form.fields.fullname}
				class="w-full"
			/>

			<FieldError>{controller.form.errors.fullname}</FieldError>

			<Input
				type="email"
				placeholder="Email"
				name="email"
				bind:value={controller.form.fields.email}
				class="w-full"
			/>

			<FieldError>{controller.form.errors.email}</FieldError>

			<Input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={controller.form.fields.password}
				class="w-full {controller.isPasswordNotSame && 'border-red-500'}"
			/>

			<FieldError>{controller.form.errors.password}</FieldError>

			<Input
				type="password"
				placeholder="Repeat Password"
				name="repeat-password"
				bind:value={controller.form.fields.repeatPassword}
				class="w-full {controller.isPasswordNotSame && 'border-red-500'}"
			/>

			<FieldError>{controller.form.errors.repeatPassword}</FieldError>
		</form>

		<Text tag="small" class="mt-8">
			Already have an account? <a href="/app/sign-in" class="text-sky-500">Sign in now!</a>
		</Text>
	</div>

	<Button
		form={formId}
		disabled={controller.signupMutation.isPending}
		type="submit"
		class="mt-auto w-full"
	>
		{#if controller.signupMutation.isPending}
			Loading...
		{:else}
			<Mail /> Sign Up
		{/if}
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
