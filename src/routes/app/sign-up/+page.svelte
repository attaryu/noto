<script lang="ts">
	import type { z } from 'zod';

	import type { ISignupPayload, ISignupResponse } from '$lib/types/api/auth/sign-up';

	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Mail from 'lucide-svelte/icons/mail';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { createValidation } from '$lib/hooks/createValidation.svelte';
	import { signUp } from '$lib/services/User/signUp';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { signupUserValidator } from '$lib/validator/user';

	type SignupInput = z.infer<typeof signupUserValidator>;

	const formId = 'sign-up';

	const form = createValidation<SignupInput>(signupUserValidator, {
		fullname: '',
		email: '',
		password: '',
		repeatPassword: '',
	});

	const isPasswordNotSame = $derived(form.fields.password !== form.fields.repeatPassword);

	const signupMutation = createMutation({
		mutationFn: (payload: ISignupPayload) =>
			axiosFetch.POST<ISignupResponse, ISignupPayload>('/auth/sign-up', payload),
	});

	const signUpHandler = form.submitHandler(async (fields) => {
		const { recoveryKeys, ...processedFields } = await signUp(fields);

		$signupMutation
			.mutateAsync({
				fullname: processedFields.fullname,
				email: processedFields.email,
				password: processedFields.password,
				secretKey: processedFields.secretKey,
				recoveryKeys: processedFields.encryptedRecoveryKeys,
			})
			.then((response) => {
				if (response?.success) {
					goto('/app/recovery-key', { state: { recoveryKeys } });
				}
			});
	});
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

		<form id={formId} class="mt-8 w-full space-y-2" onsubmit={signUpHandler}>
			<Input
				type="fullname"
				placeholder="Fullname"
				name="fullname"
				bind:value={form.fields.fullname}
				class="w-full"
			/>

			<FieldError>{form.errors.fullname}</FieldError>

			<Input
				type="email"
				placeholder="Email"
				name="email"
				bind:value={form.fields.email}
				class="w-full"
			/>

			<FieldError>{form.errors.email}</FieldError>

			<Input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={form.fields.password}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
			/>

			<FieldError>{form.errors.password}</FieldError>

			<Input
				type="password"
				placeholder="Repeat Password"
				name="repeat-password"
				bind:value={form.fields.repeatPassword}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
			/>

			<FieldError>{form.errors.repeatPassword}</FieldError>
		</form>

		{#if $signupMutation.data?.error}
			<Text tag="small" class="mt-4 text-center text-red-500"
				>{$signupMutation.data.error.message}</Text
			>
		{/if}

		<Text tag="small" class="mt-8">
			Already have an account? <a href="/app/sign-in" class="text-sky-500">Sign in now!</a>
		</Text>
	</div>

	<Button form={formId} disabled={$signupMutation.isPending} type="submit" class="mt-auto w-full">
		{#if $signupMutation.isPending}
			Loading...
		{:else}
			<Mail /> Sign Up
		{/if}
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
