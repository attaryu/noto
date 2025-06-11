<script lang="ts">
	import type { PageProps } from './$types';

	import type {
		IExportNotesResponse,
		IImportNotesPayload,
		IImportNotesResponse,
	} from '$lib/types/api/notes/backup';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { ArrowLeft, LoaderCircle, Send } from 'lucide-svelte';
	import { defaults, fileProxy, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { m } from 'paraglide/messages';

	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Header from '$lib/components/Header.svelte';
	import MenuItem from '$lib/components/Profile/MenuItem.svelte';
	import Text from '$lib/components/Text.svelte';

	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import { downloadAsTextFile } from '$lib/utils/downloadAsTextFile';
	import encryption from '$lib/utils/cryptography/encryption';
	import keyManagement from '$lib/utils/cryptography/keyManagement';
	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	const { data }: PageProps = $props();
	const toastStore = getToastStoreContext();

	const notesBackupValidator = z.object({
		backup: z
			.instanceof(File, { message: m['backup_setting_page.validation.file_type']() })
			.refine((file) => file.name.endsWith('.json'), {
				message: m['backup_setting_page.validation.extension'](),
			}),
	});

	let isLoading = $state(false);
	let isBackupTermDialogOpen = $state(false);
	let isBackupDialogOpen = $state(false);

	const importNotesMutation = createMutation<
		IImportNotesResponse,
		IErrorResponseAPI,
		IImportNotesPayload
	>({
		mutationFn: (payload) => axiosFetch.POST('/notes/backup', payload),
		onSuccess: () => {
			toastStore.setSuccess({ message: m['backup_setting_page.state.import_success']() });
			isLoading = false;
			isBackupDialogOpen = false;
		},
		onError: (error) => {
			toastStore.setError(
				generateToastHTTPError(error, { title: m['common.toast.retry'](), event: submit }),
			);
			isLoading = false;
		},
	});

	let backupFileError = $state<string[]>([]);

	const { form, enhance, submit, reset, errors } = superForm(defaults(zod(notesBackupValidator)), {
		SPA: true,
		validators: zodClient(notesBackupValidator),
		resetForm: false,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				isLoading = true;
				const fileReader = new FileReader();

				fileReader.onload = async (e) => {
					if (e.target && data.secretKey) {
						try {
							const backup: IImportNotesPayload = JSON.parse(e.target.result as string);

							if (!backup.notes || !backup.labels) {
								throw new Error(m['backup_setting_page.state.invalid_backup']());
							}

							backupFileError = [];

							const cryptographyKey = await keyManagement.importKey(data.secretKey);

							// encrypt note content
							const processedNote = await Promise.all(
								backup.notes.map(async (note) => ({
									...note,
									content: await encryption.encrypt(note.content, note.iv, cryptographyKey),
								})),
							);

							$importNotesMutation.mutate({
								notes: processedNote,
								/**
								 * labels not implemented yet
								 */
								labels: backup.labels,
							});
						} catch (error) {
							backupFileError.push((error as Error).message);
							isLoading = false;
						}
					}
				};

				fileReader.readAsText(form.data.backup);
			}
		},
	});

	const combinedBackupError = $derived([...($errors.backup ?? []), ...backupFileError]);
	const formBackupInputProxy = fileProxy(form, 'backup');

	/**
	 * auto reset the form when the dialog is closed
	 */
	$effect(() => {
		if (!isBackupDialogOpen) {
			reset();
		}
	});

	const exportNotesQuery = createQuery<IExportNotesResponse, IErrorResponseAPI>({
		queryKey: ['export-notes'],
		queryFn: () => axiosFetch.GET('/notes/backup'),
		enabled: false,
	});

	/**
	 * export notes query result processing
	 */
	$effect(() => {
		if ($exportNotesQuery.isSuccess && data.secretKey) {
			isLoading = true;

			keyManagement.importKey(data.secretKey).then(async (secretKey) => {
				// decrypt note content
				const notes = await Promise.all(
					$exportNotesQuery.data.payload.backup.notes.map(async (note) => ({
						...note,
						content: await encryption.decrypt(note.content, note.iv, secretKey),
					})),
				);

				downloadAsTextFile(
					JSON.stringify(
						{
							notes,
							/**
							 * labels not implemented yet
							 */
							labels: [],
						},
						null,
						2,
					),
					`notes-backup-${new Date().toISOString()}.json`,
					'application/json',
				);

				isLoading = false;
			});
		}
	});
</script>

<svelte:head>
	<title>{m['backup_setting_page.title']()}</title>
</svelte:head>

<main class="flex flex-col gap-8 px-4 pt-24 pb-24">
	<Header class="grid grid-cols-3 grid-rows-1 items-center border border-zinc-900 bg-white p-1">
		<Button size="icon">
			{#snippet as(props)}
				<a href="/app/settings" {...props}>
					<ArrowLeft size={32} />
				</a>
			{/snippet}
		</Button>

		<Text tag="p" styling="h3" class="text-center">{m['backup_setting_page.title']()}</Text>
	</Header>

	<section class="space-y-2">
		<Text tag="h2">{m['backup_setting_page.menu.title']()}</Text>

		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem
							text={m['backup_setting_page.menu.item.import']()}
							type="button"
							action={() => (isBackupTermDialogOpen = true)}
							disabled={isLoading}
						/>
					</li>

					<li>
						<MenuItem
							text={m['backup_setting_page.menu.item.export']()}
							type="button"
							action={$exportNotesQuery.refetch}
							disabled={isLoading}
						/>
					</li>
				</ul>
			{/snippet}
		</Card>
	</section>
</main>

<!-- import backup term confirmation dialog  -->
<Dialog
	bind:open={isBackupTermDialogOpen}
	title={m['backup_setting_page.confirmation_dialog.title']()}
>
	<Text tag="p">
		{m['backup_setting_page.confirmation_dialog.description']()}
	</Text>

	<div class="mt-6 flex justify-end gap-2">
		<Button type="button" class="px-2 py-1.5" onclick={() => (isBackupTermDialogOpen = false)}>
			{m['common.cancel']()}
		</Button>

		<Button
			type="button"
			variant="secondary"
			class="px-2 py-1.5"
			onclick={() => {
				isBackupTermDialogOpen = false;
				isBackupDialogOpen = true;
			}}
		>
			{m['common.continue']()}
		</Button>
	</div>
</Dialog>

<!-- import backup file dialog -->
<Dialog
	bind:open={isBackupDialogOpen}
	preventClose={isLoading}
	title={m['backup_setting_page.import_dialog.title']()}
>
	<form class="flex flex-col" use:enhance enctype="multipart/form-data" method="POST">
		<input
			id="backup"
			name="backup"
			type="file"
			accept=".json"
			placeholder={m['backup_setting_page.import_dialog.form.fields.file']()}
			disabled={isLoading}
			bind:files={$formBackupInputProxy}
			required
		/>

		<FieldError message={combinedBackupError} class="mt-2 text-start" />

		<Button
			type="submit"
			class={`mt-4 ml-auto ${isLoading && 'animate-spin'}`}
			disabled={isLoading}
		>
			{#if isLoading}
				<LoaderCircle size={20} />
			{:else}
				<Send size={20} />
			{/if}
		</Button>
	</form>
</Dialog>
