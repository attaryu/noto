<script lang="ts">
	import type { ISigninPayload, ISigninResponse } from '$lib/types/api/auth/sign-in';
	import type { IPasswordSaltResponse } from '$lib/types/api/user/password-salt';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import _ from 'lodash';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Mail from 'lucide-svelte/icons/mail';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { m } from 'paraglide/messages';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { userCryptography } from '$lib/business/userCrytography';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';
	import { signinUserValidator } from '$lib/validator/user';

	import encryption from '$lib/utils/cryptography/encryption';
	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	const formId = 'sign-in';
	const toastStore = getToastStoreContext();

	let salt = $state<string>();
	let passwordCryptoKey = $state<CryptoKey | undefined>();

	const passwordQuery = createQuery<IPasswordSaltResponse, IErrorResponseAPI>({
		queryKey: ['users', 'password'],
		queryFn: () => axiosFetch.GET(`/user/password-salt?email=${$form.email}`),
		enabled: false,
		retry: false,
	});

	$effect(() => {
		if ($passwordQuery.isSuccess) {
			salt = $passwordQuery.data.payload.salt;
		}
	});

	const refetchPasswordQuery = _.debounce(() => {
		$passwordQuery.refetch();
	}, 500);

	const signinMutation = createMutation<ISigninResponse, IErrorResponseAPI, ISigninPayload>({
		mutationFn: (payload) => axiosFetch.POST('/auth/sign-in', payload),
		onSuccess: async (data) => {
			const { user } = data.payload;

			if (!passwordCryptoKey) {
				toastStore.setError({
					message: m['sign_in_page.state.password_crypto_key_error.text'](),
					action: {
						title: m['sign_in_page.state.password_crypto_key_error.cta'](),
						event: submit,
					},
				});

				return;
			}

			const secretKey = await encryption.decrypt(
				user.secretKey.value,
				user.secretKey.iv,
				passwordCryptoKey,
			);

			await secretKeyManagement.storeSecretKey(secretKey);
			reset();

			toastStore.setSuccess({ message: m['sign_in_page.state.sign_in_success']() });

			goto('/app/notes');
		},
		onError: (error) => {
			toastStore.setError(
				generateToastHTTPError(error, { title: m['common.toast.retry'](), event: submit }),
			);
		},
	});

	const { form, errors, reset, enhance, submit } = superForm(defaults(zod(signinUserValidator)), {
		SPA: true,
		validators: zodClient(signinUserValidator),
		resetForm: false,
		onUpdate: async ({ form }) => {
			if (salt && form.valid) {
				const passwordKey = await userCryptography.generatePasswordKey(form.data.password, salt);

				passwordCryptoKey = passwordKey.key;

				$signinMutation.mutate({ ...form.data, password: passwordKey.hashedKey });
			}
		},
	});

	$effect(() => {
		if ($form.email && !$errors.email) {
			refetchPasswordQuery();
		}
	});

	$effect(() => {
		if ($passwordQuery.isError && !$errors.email) {
			$errors.email = [$passwordQuery.error?.error.message];
		}
	});
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
		<Text tag="h1" class="mt-auto text-center">
			{m['sign_in_page.greeting']()}
		</Text>

		<Text class="mt-4 text-center">
			{m['sign_in_page.description']()}
		</Text>

		<form id={formId} class="mt-8 w-full space-y-2" use:enhance method="POST">
			<Input
				type="email"
				placeholder={m['common.fields.email']()}
				name="email"
				class="w-full"
				bind:value={$form.email}
			/>

			<FieldError message={$errors.email} />

			<Input
				type="password"
				placeholder={m['common.fields.password']()}
				name="password"
				class="w-full"
				bind:value={$form.password}
			/>

			<FieldError message={$errors.password} />
		</form>

		<Text tag="small" class="mt-8">
			{m['sign_in_page.forgot_password.text']()}{' '}

			<a href="/app/account-recovery/step-1" class="text-sky-500">
				{m['sign_in_page.forgot_password.cta']()}
			</a>
		</Text>

		<Text tag="small" class="mt-4">
			{m['sign_in_page.sign_up_link.text']()}{' '}

			<a href="/app/sign-up" class="text-sky-500">
				{m['sign_in_page.sign_up_link.cta']()}
			</a>
		</Text>
	</div>

	<Button form={formId} type="submit" class="mt-auto w-full" disabled={$signinMutation.isPending}>
		{#if $signinMutation.isPending}
			{m['common.loading']()}...
		{:else}
			<Mail /> {m['sign_in_page.form.submit']()}
		{/if}
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
