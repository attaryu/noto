<script lang="ts">
	import type { ISignupPayload, ISignupResponse } from '$lib/types/api/auth/sign-up';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import { ArrowLeft } from 'lucide-svelte';
	import Mail from 'lucide-svelte/icons/mail';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { m } from 'paraglide/messages';

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

			toastStore.setSuccess({ message: m['sign_up_page.state.sign_up_success']() });

			goto('/app/recovery-key', { state: { recoveryKeys } });
		},
		onError: (error) => {
			toastStore.setError(
				generateToastHTTPError(error, { title: m['common.toast.retry'](), event: submit }),
			);
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
		<Button>
			{#snippet as(props?: any)}
				<a href="/app/sign-in" {...props}>
					<ArrowLeft />
				</a>
			{/snippet}
		</Button>
	</header>

	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">
			{m['sign_up_page.greeting']()}
		</Text>

		<Text class="mt-4 text-center">
			{m['sign_up_page.description']()}
		</Text>

		<form id={formId} class="mt-8 w-full space-y-2" use:enhance method="POST">
			<Input
				type="fullname"
				placeholder={m['common.fields.fullname']()}
				name="fullname"
				bind:value={$form.fullname}
				class="w-full"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.fullname} />

			<Input
				type="email"
				placeholder={m['common.fields.email']()}
				name="email"
				bind:value={$form.email}
				class="w-full"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.email} />

			<Input
				type="password"
				placeholder={m['common.fields.password']()}
				name="password"
				bind:value={$form.password}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.password} />

			<Input
				type="password"
				placeholder={m['common.fields.repeat_password']()}
				name="repeat-password"
				bind:value={$form.repeatPassword}
				class="w-full {isPasswordNotSame && 'border-red-500'}"
				disabled={$signupMutation.isPending}
			/>

			<FieldError message={$errors.repeatPassword} />
		</form>

		<Text tag="small" class="mt-8">
			{m['sign_up_page.sign_in_link.text']()}{' '}

			<a href="/app/sign-in" class="text-sky-500">
				{m['sign_up_page.sign_in_link.cta']()}
			</a>
		</Text>
	</div>

	<Button form={formId} disabled={$signupMutation.isPending} type="submit" class="mt-auto w-full">
		{#if $signupMutation.isPending}
			{m['common.loading']()}...
		{:else}
			<Mail /> {m['sign_up_page.form.submit']()}
		{/if}
	</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
