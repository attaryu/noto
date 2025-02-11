<script lang="ts">
	import type { EventHandler } from 'svelte/elements';

	import type { IResponseAPI } from '$lib/types/response';
	import {
		createUserInputDTO,
		type ICreateUserDTO,
		type ICreateUserInputDTO,
		type IUser,
	} from '$lib/types/entities/User';

	import { createMutation } from '@tanstack/svelte-query';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Mail from 'lucide-svelte/icons/mail';
	import { goto } from '$app/navigation';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { signUp } from '$lib/services/User/signUp';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { createValidation } from '$lib/hooks/createValidation.svelte';

	const formId = 'sign-up';

	const form = createValidation<ICreateUserInputDTO>(
		{
			fullname: '',
			email: '',
			password: '',
			repeatPassword: '',
		},
		createUserInputDTO,
	);

	const isPasswordNotSame = $derived(form.fields.password !== form.fields.repeatPassword);

	const api = createMutation({
		mutationFn: (payload: ICreateUserDTO) =>
			axiosFetch.POST<IResponseAPI<IUser>, ICreateUserDTO>('/auth/sign-up', payload),
	});

	const signUpHandler = form.submitHandler(async (fields) => {
		const { recoveryKeys, ...processedFields } = await signUp(fields);

		$api
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

		<form id={formId} class="mt-8 space-y-2 w-full" onsubmit={signUpHandler}>
			<Input
				type="fullname"
				placeholder="Fullname"
				name="fullname"
				bind:value={form.fields.fullname}
				class="w-full"
			/>

			{#if form.errors?.fullname}
				<Text tag="small" class="text-center text-red-500">{form.errors.fullname}</Text>
			{/if}

			<Input
				type="email"
				placeholder="Email"
				name="email"
				bind:value={form.fields.email}
				class="w-full"
			/>

			{#if form.errors?.email}
				<Text tag="small" class="text-center text-red-500">{form.errors.email}</Text>
			{/if}

			<Input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={form.fields.password}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
			/>

			{#if form.errors?.password}
				<Text tag="small" class="text-center text-red-500">{form.errors.password}</Text>
			{/if}

			<Input
				type="password"
				placeholder="Repeat Password"
				name="repeat-password"
				bind:value={form.fields.repeatPassword}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
			/>
		</form>

		{#if form.errors?.repeatPassword}
			<Text tag="small" class="text-center text-red-500">{form.errors.repeatPassword}</Text>
		{/if}

		{#if $api.data?.error}
			<Text tag="small" class="mt-4 text-center text-red-500">{$api.data.error.message}</Text>
		{/if}

		<Text tag="small" class="mt-8">
			Already have an account? <a href="/app/sign-in" class="text-sky-500">Sign in now!</a>
		</Text>
	</div>

	<Button form={formId} disabled={$api.isPending} type="submit" class="mt-auto w-full">
		{#if $api.isPending}
			Loading...
		{:else}
			<Mail /> Sign Up
		{/if}
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
