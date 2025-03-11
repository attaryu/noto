<script lang="ts">
	import type { z } from 'zod';

	import type {
		IRecoverEmailPayload,
		IRecoverEmailResponse,
	} from '$lib/types/api/auth/recover-email';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Send from 'lucide-svelte/icons/send';
	import { createMutation } from '@tanstack/svelte-query';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { createValidation } from '$lib/hooks/createValidation.svelte';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import { accountRecoveryValidator } from '$lib/validator/user';

	const formId = 'account-recovery-step-1';
	const toast = getToastStoreContext();

	const form = createValidation<z.infer<typeof accountRecoveryValidator>>(
		accountRecoveryValidator,
		{ email: '' },
	);

	const recoverEmailMutation = createMutation<
		IRecoverEmailResponse,
		IErrorResponseAPI,
		IRecoverEmailPayload
	>({
		mutationFn: (payload) => axiosFetch.POST('/auth/recover-email', payload),
		onSuccess: () => {
			toast.setToast({
				message: 'Success, please check your email',
				type: 'success',
			});
		},
		onError: (error) => {
			toast.setToast({
				message: error.error.message ?? 'An error occurred',
				type: 'error',
			});
		},
	});

	const submitHandler = form.submitHandler((data) => {
		$recoverEmailMutation.mutate(data);
	});
</script>

<main class="flex h-screen flex-col p-4">
	<header class="h-12">
		<Button>
			{#snippet as(prop: any)}
				<a href="/app/sign-in" {...prop}><ArrowLeft /></a>
			{/snippet}
		</Button>
	</header>

	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">Account Recovery</Text>

		<Text tag="p" class="mt-4 text-center">
			We will send an email message along with a link to enter the recovery key
		</Text>

		<form action="" id={formId} class="mt-8 w-full" onsubmit={submitHandler}>
			<Input
				type="email"
				name="email"
				placeholder="Email"
				class="w-full"
				value={form.fields.email}
				oninput={({ currentTarget }) => (form.fields.email = currentTarget.value ?? '')}
			/>
		</form>
	</div>

	<Button
		form={formId}
		type="submit"
		class="mt-auto w-full"
		disabled={$recoverEmailMutation.isPending}
	>
		{#if $recoverEmailMutation.isPending}
			Loading...
		{:else}
			<Send /> Send now
		{/if}
	</Button>
</main>

<Decorator size="normal" color="yellow" class="top-0" />
<Decorator size="normal" color="green" class="-right-1/3 top-1/3" />
<Decorator size="large" color="yellow" class="-bottom-1/4 left-1/4" />
