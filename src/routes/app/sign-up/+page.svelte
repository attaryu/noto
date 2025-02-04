<script lang="ts">
	import type { EventHandler } from 'svelte/elements';

	import type { IResponseAPI } from '$lib/types/response';
	import type { ICreateUserDTO, IUserResponse } from '$lib/types/entities/user';

	import { createMutation } from '@tanstack/svelte-query';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Mail from 'lucide-svelte/icons/mail';
	import { goto } from '$app/navigation';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { createCryptography } from '$lib/services/User/createCryptography';
	import { axiosFetch } from '$lib/stores/api/baseConfig';

	const formId = 'sign-up';

	const registerForm = $state({
		fullname: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const isPasswordNotSame = $derived(registerForm.password !== registerForm.confirmPassword);

	const api = createMutation({
		mutationFn: (payload: ICreateUserDTO) =>
			axiosFetch.POST<IResponseAPI<IUserResponse>, ICreateUserDTO>('/auth/sign-up', payload),
	});

	const signUpHandler: EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
		e.preventDefault();

		const { recoveryKeys, ...cryptographyKeys } = await createCryptography(registerForm.password);

		$api
			.mutateAsync({
				fullname: registerForm.fullname,
				email: registerForm.email,
				password: cryptographyKeys.password,
				secretKey: cryptographyKeys.secretKey,
				recoveryKeys: cryptographyKeys.encryptedRecoveryKeys,
			})
			.then((response) => {
				if (response?.success) {
					goto('/app/recovery-key', { state: { recoveryKeys } });
				}
			});
	};
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

		<form id={formId} class="mt-8 space-y-2" onsubmit={signUpHandler}>
			<Input
				type="fullname"
				placeholder="Fullname"
				name="fullname"
				bind:value={registerForm.fullname}
				class="w-full"
				required
			/>

			<Input
				type="email"
				placeholder="Email"
				name="email"
				bind:value={registerForm.email}
				class="w-full"
				required
			/>

			<Input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={registerForm.password}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
				minlength={10}
				required
			/>

			<Input
				type="password"
				placeholder="Confirm Password"
				name="confirm-password"
				bind:value={registerForm.confirmPassword}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
				minlength={10}
				required
			/>
		</form>

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
