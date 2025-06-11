<script lang="ts">
	import type { IUserSecurityPayload, IUserSecurityResponse } from '$lib/types/api/user/security';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';
	import Send from '@lucide/svelte/icons/send';
	import { m } from 'paraglide/messages';
	import { onMount } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { userCryptography } from '$lib/business/userCrytography';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';
	import { generateToastHTTPError } from '$lib/utils/toastMessage';
	import { resetPasswordValidator } from '$lib/validator/user';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	const formId = 'account-recovery-step-3';
	const toastStore = getToastStoreContext();

	let secretKey = $state<string>();
	let recoveryKeys = $state.raw<string[]>([]);

	onMount(() => {
		if (window) {
			/**
			 * Take the secret key from the second step
			 */
			secretKeyManagement.getSecretKey().then((key) => {
				if (key) {
					secretKey = key;
					return;
				}

				goto('/app/account-recovery/step-1', { replaceState: true });
			});
		}
	});

	const userSecurityMutation = createMutation<
		IUserSecurityResponse,
		IErrorResponseAPI,
		IUserSecurityPayload
	>({
		mutationFn: (data) => axiosFetch.PUT('/user/security', data),
		onSuccess: () => {
			secretKeyManagement.removeSecretKey();
			reset();

			goto('/app/recovery-key', { replaceState: true, state: { recoveryKeys } });
		},
		onError: (error) => {
			toastStore.setError(
				generateToastHTTPError(error, { title: m['common.toast.retry'](), event: submit }),
			);
		},
	});

	const { form, errors, enhance, reset, submit } = superForm(
		defaults(zod(resetPasswordValidator)),
		{
			SPA: true,
			resetForm: false,
			validators: zodClient(resetPasswordValidator),
			onUpdate: async ({ form }) => {
				if (form.valid && secretKey) {
					const cryptoKeys = await userCryptography.regenerateCryptoKeys(
						form.data.password,
						secretKey,
					);

					recoveryKeys = cryptoKeys.recoveryKeys;

					$userSecurityMutation.mutate({
						password: cryptoKeys.password,
						secretKey: cryptoKeys.secretKey,
						recoveryKeys: cryptoKeys.encryptedRecoveryKeys,
					});
				}
			},
		},
	);
</script>

{#if secretKey}
	<main class="flex h-screen flex-col p-4">
		<div class="mt-20 flex flex-col items-center">
			<Text tag="h1" class="text-center">
				{m['account_recovery_step_3_page.heading']()}
			</Text>

			<Text tag="p" class="mt-4 text-center">
				{m['account_recovery_step_3_page.description']()}
			</Text>

			<form method="POST" id={formId} class="mt-8 w-full space-y-2" use:enhance>
				<Input
					type="password"
					name="password"
					placeholder={m['common.fields.password']()}
					class="w-full"
					bind:value={$form.password}
				/>
				<FieldError message={$errors.password} />

				<Input
					type="password"
					name="repeatPassword"
					placeholder={m['common.fields.repeat_password']()}
					class="w-full"
					bind:value={$form.repeatPassword}
				/>
				<FieldError message={$errors.repeatPassword} />
			</form>
		</div>

		<Button form={formId} type="submit" size="lg" class="mt-auto w-full">
			<Send />
			{m['account_recovery_step_3_page.form.submit']()}
		</Button>
	</main>
{/if}
