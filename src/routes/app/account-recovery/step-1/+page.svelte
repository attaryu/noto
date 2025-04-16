<script lang="ts">
	import type {
		IRecoverEmailPayload,
		IRecoverEmailResponse,
	} from '$lib/types/api/auth/recover-email';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { createMutation } from '@tanstack/svelte-query';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Send from 'lucide-svelte/icons/send';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { m } from 'paraglide/messages';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';
	import FieldError from '$lib/components/FieldError.svelte';

	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';
	import { accountRecoveryValidator } from '$lib/validator/user';
	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	const formId = 'account-recovery-step-1';
	const toastStore = getToastStoreContext();

	const recoverEmailMutation = createMutation<
		IRecoverEmailResponse,
		IErrorResponseAPI,
		IRecoverEmailPayload
	>({
		mutationFn: (payload) => axiosFetch.POST('/auth/recover-email', payload),
		onSuccess: () => {
			toastStore.setSuccess({
				message: m['account_recovery_step_1_page.state.email_sent_success'](),
			});

			reset();
		},
		onError: (error) => {
			toastStore.setError(generateToastHTTPError(error, { title: m['common.toast.retry'](), event: submit }));
		},
	});

	const { form, errors, enhance, reset, submit } = superForm(
		defaults(zod(accountRecoveryValidator)),
		{
			SPA: true,
			resetForm: false,
			validators: zodClient(accountRecoveryValidator),
			onUpdate: ({ form }) => {
				if (form.valid) {
					$recoverEmailMutation.mutate(form.data);
				}
			},
		},
	);
</script>

<main class="flex h-screen flex-col p-4">
	<header class="h-12">
		<Button>
			{#snippet as(prop: any)}
				<a href="/app/settings" {...prop}><ArrowLeft /></a>
			{/snippet}
		</Button>
	</header>

	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">
			{m['account_recovery_step_1_page.heading']()}
		</Text>

		<Text tag="p" class="mt-4 text-center">
			{m['account_recovery_step_1_page.description']()}
		</Text>

		<form method="POST" id={formId} class="mt-8 w-full" use:enhance>
			<Input
				type="email"
				name="email"
				placeholder={m['common.fields.email']()}
				class="w-full"
				bind:value={$form.email}
			/>

			<FieldError message={$errors.email} />
		</form>
	</div>

	<Button
		form={formId}
		type="submit"
		class="mt-auto w-full"
		disabled={$recoverEmailMutation.isPending}
	>
		{#if $recoverEmailMutation.isPending}
			{m['common.loading']()}...
		{:else}
			<Send /> {m['account_recovery_step_1_page.form.submit']()}
		{/if}
	</Button>
</main>

<Decorator size="normal" color="yellow" class="top-0" />
<Decorator size="normal" color="green" class="-right-1/3 top-1/3" />
<Decorator size="large" color="yellow" class="-bottom-1/4 left-1/4" />
