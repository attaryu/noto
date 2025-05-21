<script lang="ts">
	import type { PageProps } from './$types';

	import type { IRecoveryKeyResponse } from '$lib/types/api/user/recovery-key';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import { KeyRound } from 'lucide-svelte';
	import { m } from 'paraglide/messages';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';
	import { secretKeyManagement } from '$lib/business/secretKeyManagement';

	import encryption from '$lib/utils/cryptography/encryption';
	import keyManagement from '$lib/utils/cryptography/keyManagement';

	const { data }: PageProps = $props();

	const formId = 'account-recovery-step-2';
	const toastStore = getToastStoreContext();

	let recoveryKeyFromUser = $state('');
	const recoveryKeyUpperCase = $derived(recoveryKeyFromUser.toUpperCase());
	const firstRecoveryKeyPair = $derived(recoveryKeyUpperCase.slice(0, 4));

	/**
	 * get recovery key from the server every time the first 4 digits change.
	 * reset token will be obtained if the user successfully gets a recovery key.
	 */
	const recoveryKeyQuery = $derived(
		createQuery<IRecoveryKeyResponse, IErrorResponseAPI>({
			queryKey: ['recovery-key', firstRecoveryKeyPair],
			queryFn: () =>
				axiosFetch.GET(
					`/user/recovery-key?key-order=${firstRecoveryKeyPair}&recovery-token=${data.token}`,
				),
			retry: false,
			enabled: firstRecoveryKeyPair.length === 4,
		}),
	);

	async function submitHandler(e: EventParameter<SubmitEvent, HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();

		if (!$recoveryKeyQuery.isSuccess) {
			return;
		}

		try {
			// make PBKDF2 key with recovery key from user input and salt from the server
			const recoveryKeyPBKDF2 = await keyManagement.importKeyFromString(
				recoveryKeyUpperCase,
				$recoveryKeyQuery.data.payload.recoveryKey.salt,
			);

			// decrypt the secret key with the PBKDF2 key
			const secretKey = await encryption.decrypt(
				$recoveryKeyQuery.data.payload.recoveryKey.value,
				$recoveryKeyQuery.data.payload.recoveryKey.iv,
				recoveryKeyPBKDF2,
			);

			// store the secret key in the local storage for next step account recovery
			await secretKeyManagement.storeSecretKey(secretKey);

			goto(`/app/account-recovery/step-3`, { replaceState: true });
		} catch {
			toastStore.setError({
				message: m['account_recovery_step_2_page.state.incorrect_recovery_key'](),
			});
		}
	}
</script>

<main class="flex h-screen flex-col p-4">
	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">
			{m['account_recovery_step_2_page.heading']()}
		</Text>

		<Text tag="p" class="mt-4 text-center">
			{m['account_recovery_step_2_page.description']()}
		</Text>

		<form action="" id={formId} class="mt-8 w-full" onsubmit={submitHandler}>
			<Input
				type="text"
				placeholder={m['account_recovery_step_2_page.form.fields.recovery_key']()}
				class="w-full text-center uppercase placeholder:normal-case"
				required
				maxlength={8}
				bind:value={recoveryKeyFromUser}
			/>

			<FieldError class="mt-4" message={$recoveryKeyQuery.error?.error.message} />
		</form>
	</div>

	<Button
		form={formId}
		type="submit"
		class="mt-auto w-full"
		disabled={$recoveryKeyQuery.isLoading || !$recoveryKeyQuery.data}
	>
		<KeyRound />
		{m['account_recovery_step_2_page.form.submit']()}
	</Button>
</main>
