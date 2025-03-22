<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Mail from 'lucide-svelte/icons/mail';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';
	import type { z } from 'zod';
	import { createValidation } from '$lib/hooks/createValidation.svelte';
	import { signinUserValidator } from '$lib/validator/user';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import type { IErrorResponseAPI } from '$lib/types/response';
	import type { IPasswordSaltResponse } from '$lib/types/api/users/password-salt';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import _ from 'lodash';
	import type { ISigninPayload, ISigninResponse } from '$lib/types/api/auth/sign-in';
	import encryption from '$lib/utils/cryptography/encryption';
	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { userCryptography } from '$lib/business/userCrytography';

	const formId = 'sign-in';
	const toast = getToastStoreContext();

	const form = createValidation<z.infer<typeof signinUserValidator>>(signinUserValidator, {
		email: '',
		password: '',
	});

	const passwordQuery = createQuery<IPasswordSaltResponse, IErrorResponseAPI>({
		queryKey: ['users', 'password'],
		queryFn: () => axiosFetch.GET(`/users/password-salt?email=${form.fields.email}`),
		enabled: false,
		retry: false,
	});

	const refetchPasswordQuery = _.debounce(() => {
		$passwordQuery.refetch();
	}, 500);

	$effect(() => {
		if (form.fields.email) {
			refetchPasswordQuery();
		}
	});

	let passwordCryptoKey = $state<CryptoKey | undefined>();

	const signinMutation = createMutation<ISigninResponse, IErrorResponseAPI, ISigninPayload>({
		mutationFn: (payload) => axiosFetch.POST('/auth/sign-in', payload),
		onSuccess: async (data) => {
			const { user } = data.payload;

			if (passwordCryptoKey) {
				const secretKey = await encryption.decrypt(
					user.secretKey.value,
					user.secretKey.iv,
					passwordCryptoKey,
				);

				await secretKeyManagement.storeSecretKey(secretKey);

				goto('/app/notes');
			}
		},
		onError: (error) => {
			toast.set({
				message: error.error.message ?? 'An error occurred',
				type: 'error',
			});
		},
	});

	const submitHandler = $derived(
		form.submitHandler(async (fields) => {
			if ($passwordQuery.isSuccess) {
				const passwordKey = await userCryptography.generatePasswordKey(
					fields.password,
					$passwordQuery.data.payload.salt,
				);

				passwordCryptoKey = passwordKey.key;

				$signinMutation.mutate({
					...fields,
					password: passwordKey.hashedKey,
				});
			}
		}),
	);

	const emailErrorMessage = $derived(
		$passwordQuery.isError && form.fields.email
			? $passwordQuery.error?.error.message
			: form.errors?.email,
	);
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

		<form id={formId} class="mt-8 w-full space-y-2" onsubmit={submitHandler}>
			<Input
				type="email"
				placeholder="Email"
				name="email"
				class="w-full"
				value={form.fields.email}
				oninput={({ currentTarget }) => (form.fields.email = currentTarget.value ?? '')}
			/>

			<FieldError>{emailErrorMessage}</FieldError>

			<Input
				type="password"
				placeholder="Password"
				name="password"
				class="w-full"
				bind:value={form.fields.password}
			/>

			<FieldError>{form.errors?.password}</FieldError>
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
		disabled={$signinMutation.isPending || !form.isValid}
	>
		{#if $signinMutation.isPending}
			Loading...
		{:else}
			<Mail /> Sign In
		{/if}
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
