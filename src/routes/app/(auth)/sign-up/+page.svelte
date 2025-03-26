<script lang="ts">
	import type { ISignupPayload, ISignupResponse } from '$lib/types/api/auth/sign-up';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Mail from 'lucide-svelte/icons/mail';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { userCryptography } from '$lib/business/userCrytography';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';
	import { signupUserValidator } from '$lib/validator/user';

	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	const formId = 'sign-up';
	const toastStore = getToastStoreContext();

	let recoveryKeys = $state.raw<string[]>([]);

	const signupMutation = createMutation<ISignupResponse, IErrorResponseAPI, ISignupPayload>({
		mutationFn: (payload) => axiosFetch.POST('/auth/sign-up', payload),
		onSuccess: () => {
			reset();

			toastStore.setSuccess({ message: 'Sign up successful!' });

			goto('/app/recovery-key', { state: { recoveryKeys } });
		},
		onError: (error) => {
			toastStore.setError(generateToastHTTPError(error, { title: 'Retry', event: submit }));
		},
	});

	const { form, errors, enhance, reset, submit } = superForm(defaults(zod(signupUserValidator)), {
		SPA: true,
		validators: zodClient(signupUserValidator),
		resetForm: false,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				const { encryptedRecoveryKeys, ...cryptographyKeys } =
					await userCryptography.generateCryptoKeys(form.data.password);

				recoveryKeys = cryptographyKeys.recoveryKeys;

				$signupMutation.mutate({
					...cryptographyKeys,
					fullname: form.data.fullname,
					email: form.data.email,
					recoveryKeys: encryptedRecoveryKeys,
				});
			}
		},
	});

	const isPasswordNotSame = $derived($form.password !== $form.repeatPassword);
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

		<form id={formId} class="mt-8 w-full space-y-2" use:enhance method="POST">
			<Input
				type="fullname"
				placeholder="Fullname"
				name="fullname"
				bind:value={$form.fullname}
				class="w-full"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.fullname} />

			<Input
				type="email"
				placeholder="Email"
				name="email"
				bind:value={$form.email}
				class="w-full"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.email} />

			<Input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={$form.password}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.password} />

			<Input
				type="password"
				placeholder="Repeat Password"
				name="repeat-password"
				bind:value={$form.repeatPassword}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.repeatPassword} />
		</form>

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
