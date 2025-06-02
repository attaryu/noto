<script lang="ts">
	import type {
		IUpdateUserBasicInfoPayload,
		IUpdateUserBasicInfoResponse,
	} from '$lib/types/api/user';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { ArrowLeft } from 'lucide-svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import _ from 'lodash';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { m } from 'paraglide/messages';

	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Header from '$lib/components/Header.svelte';
	import Text from '$lib/components/Text.svelte';

	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';
	import { getUserStore } from '$lib/stores/user.svelte';
	import { updateUserValidator } from '$lib/validator/user';

	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	const user = getUserStore();
	const defaultValues = $derived({ fullname: user.fullname, email: user.email });
	const toastStore = getToastStoreContext();

	let isEditable = $state(false);

	const mutation = createMutation<
		IUpdateUserBasicInfoResponse,
		IErrorResponseAPI,
		IUpdateUserBasicInfoPayload
	>({
		mutationFn: (payload) => axiosFetch.PATCH('/user', payload),
		onSuccess: (response) => {
			toastStore.setSuccess({ message: m['account_setting_page.state.update_success']() });

			isEditable = false;
			user.update(response.payload.user);
		},
		onError: (error) => {
			toastStore.setError(
				generateToastHTTPError(error, { title: m['common.toast.retry'](), event: submit }),
			);
		},
	});

	/**
	 * Not using the default value of superForm, because they use store while here using
	 * universal state.
	 */
	const { form, errors, submit, enhance } = superForm(defaults(zod(updateUserValidator)), {
		SPA: true,
		validators: zodClient(updateUserValidator),
		resetForm: false,
		onUpdate: ({ form }) => {
			if (form.valid) {
				$mutation.mutate(form.data);
			}
		},
	});

	/**
	 * Set form defaut values and reset manually.
	 */
	function manualReset() {
		$form.fullname = defaultValues.fullname;
		$form.email = defaultValues.email;
	}

	// reflect the form state to the global user state
	$effect(() => {
		if (defaultValues) {
			manualReset();
		}
	});
</script>

<main class="flex flex-col gap-8 px-4 pb-24 pt-24">
	<Header class="grid grid-cols-3 grid-rows-1 items-center border border-zinc-900 bg-white p-1">
		<Button>
			{#snippet as(props)}
				<a href="/app/settings" {...props}>
					<ArrowLeft />
				</a>
			{/snippet}
		</Button>

		<Text tag="p" styling="h3" class="text-center">
			{m['account_setting_page.title']()}
		</Text>
	</Header>

	<Card color="green">
		<form method="POST" use:enhance class="flex flex-col gap-2">
			<input
				type="text"
				name="fullname"
				id="fullname"
				placeholder={m['common.fields.fullname']()}
				bind:value={$form.fullname}
				class="mt-1 w-full border-b border-zinc-900 bg-transparent py-1 text-xl outline-none disabled:border-none disabled:opacity-80"
				disabled={!isEditable || $mutation.isPending}
			/>

			<FieldError message={$errors.fullname} class="text-start" />

			<input
				type="email"
				name="email"
				id="email"
				placeholder={m['common.fields.email']()}
				bind:value={$form.email}
				class="mt-1 w-full border-b border-zinc-900 bg-transparent py-1 text-xl outline-none disabled:border-none disabled:opacity-80"
				disabled={!isEditable || $mutation.isPending}
			/>

			<FieldError message={$errors.email} class="text-start" />

			<div class="ml-auto flex w-full gap-2 pt-6">
				{#if isEditable}
					<Button
						type="reset"
						class="w-full bg-transparent p-2"
						variant="secondary"
						onclick={() => {
							manualReset();
							isEditable = false;
						}}
					>
						{m['account_setting_page.form.cancel']()}
					</Button>

					<Button
						type="submit"
						class="w-full p-2"
						variant="primary"
						disabled={$mutation.isPending || _.isEqual($form, defaultValues)}
					>
						{$mutation.isPending
							? `${m['common.loading']()}...`
							: m['account_setting_page.form.save']()}
					</Button>
				{:else}
					<Button
						type="button"
						class="w-full p-2"
						variant="secondary"
						onclick={() => (isEditable = true)}
					>
						{m['account_setting_page.form.edit']()}
					</Button>
				{/if}
			</div>
		</form>
	</Card>
</main>
