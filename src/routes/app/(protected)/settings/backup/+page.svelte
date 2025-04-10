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
			.instanceof(File, { message: 'Input must be a file' })
			.refine((file) => file.name.endsWith('.json'), {
				message: 'File must be a JSON extension',
			}),
	});

	let isLoading = $state(false);
	let isBackupTermDialogOpen = $state(true);
	let isBackupDialogOpen = $state(false);

	const importNotesMutation = createMutation<
		IImportNotesResponse,
		IErrorResponseAPI,
		IImportNotesPayload
	>({
		mutationFn: (payload) => axiosFetch.POST('/notes/backup', payload),
		onSuccess: () => {
			toastStore.setSuccess({ message: 'Notes imported successfully' });
			isLoading = false;
			isBackupDialogOpen = false;
		},
		onError: (error) => {
			toastStore.setError(generateToastHTTPError(error, { title: 'Retry', event: submit }));
			isLoading = false;
		},
	});

	let customBackupError = $state<string[]>([]);

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
								throw new Error('Invalid backup file');
							}

							customBackupError = [];

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
							customBackupError.push((error as Error).message);
							isLoading = false;
						}
					}
				};

				fileReader.readAsText(form.data.backup);
			}
		},
	});

	const combinedBackupError = $derived([...($errors.backup ?? []), ...customBackupError]);
	const formBackupInputProxy = fileProxy(form, 'backup');

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

	$effect(() => {
		if ($exportNotesQuery.isSuccess && data.secretKey) {
			isLoading = true;

			keyManagement.importKey(data.secretKey).then(async (secretKey) => {
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
	<title>Backup</title>
</svelte:head>

<main class="flex flex-col gap-8 px-4 pb-24 pt-24">
	<Header class="grid grid-cols-3 grid-rows-1 items-center border border-zinc-900 bg-white p-1">
		<Button onclick={() => history.back()}>
			<ArrowLeft />
		</Button>

		<Text tag="p" styling="h3" class="text-center">Backup</Text>
	</Header>

	<section class="space-y-2">
		<Text tag="h2">As File</Text>

		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem
							text="Export"
							type="button"
							action={$exportNotesQuery.refetch}
							disabled={isLoading}
						/>
					</li>

					<li>
						<MenuItem
							text="Import"
							type="button"
							action={() => (isBackupTermDialogOpen = true)}
							disabled={isLoading}
						/>
					</li>
				</ul>
			{/snippet}
		</Card>
	</section>
</main>

<!-- import backup term confirmation dialog  -->
<Dialog bind:open={isBackupTermDialogOpen} title="Import backup notes">
	<Text tag="p">
		Are you sure you want to import backup notes? This action will overwrite your current notes.
	</Text>

	<div class="mt-6 flex justify-end gap-2">
		<Button type="button" class="px-2 py-1.5" onclick={() => (isBackupTermDialogOpen = false)}>
			Cancel
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
			Continue
		</Button>
	</div>
</Dialog>

<!-- import backup file dialog -->
<Dialog bind:open={isBackupDialogOpen} preventClose={isLoading} title="Import backup file">
	<form class="flex flex-col" use:enhance enctype="multipart/form-data" method="POST">
		<input
			id="backup"
			name="backup"
			type="file"
			accept=".json"
			placeholder="Upload backup file here"
			disabled={isLoading}
			bind:files={$formBackupInputProxy}
			required
		/>

		<FieldError message={combinedBackupError} class="mt-2 text-start" />

		<Button
			type="submit"
			class={`ml-auto mt-4 ${isLoading && 'animate-spin'}`}
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

<Decorator color="green" class="-left-0 -top-8" />
<Decorator color="yellow" class="-right-1/2 top-1/4" size="large" />
<Decorator color="yellow" class="-left-1/2 top-1/2" size="large" />
