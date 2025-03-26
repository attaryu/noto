<script lang="ts">
	import type { Editor, JSONContent } from '@tiptap/core';
	import type { Readable } from 'svelte/store';
	import type { PageProps } from './$types';

	import type { INoteResponse, INoteUpdate } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { createMutation, createQuery } from '@tanstack/svelte-query';

	import Controller from '$lib/components/Editor/Controller.svelte';
	import Header from '$lib/components/Editor/Header.svelte';

	import noteManagement from '$lib/business/noteManagement';
	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import keyManagement from '$lib/utils/cryptography/keyManagement';
	import createEditor from '$lib/utils/editor';
	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	const { data }: PageProps = $props();
	const toastStore = getToastStoreContext();

	let editorElement = $state<HTMLDivElement>();
	let editor = $state.raw<Readable<Editor>>();
	let originalData = $state<JSONContent>();

	const noteMutation = createMutation<INoteResponse, IErrorResponseAPI, INoteUpdate>({
		mutationFn: (payload) => axiosFetch.PATCH(`/notes/${data.noteId}`, payload),
		onSuccess: () => {
			toastStore.setSuccess({ message: 'Saved successfully' });
		},
		onError: (error) => {
			toastStore.setError(generateToastHTTPError(error, { title: 'Retry', event: onsave }));
		},
	});

	const noteQuery = createQuery<INoteResponse, IErrorResponseAPI>({
		queryKey: ['notes', 'detail', data.noteId],
		queryFn: () => axiosFetch.GET(`/notes/${data.noteId}`),
	});

	async function onsave() {
		if (!$editor || $editor.isEmpty) {
			toastStore.setError({ message: 'Note cannot be empty' });

			return;
		}

		const secretKey = await secretKeyManagement.getSecretKey();

		if (!secretKey) {
			toastStore.setError({ message: 'Secret key not found. Please sign in again!' });

			return;
		}

		const rawSecretKey = await keyManagement.importKey(secretKey);
		const { iv, ...processNote } = await noteManagement.processContent(
			$editor.getJSON(),
			rawSecretKey,
			$noteQuery.data!.payload.note.iv,
		);

		$noteMutation.mutate(processNote);
	}

	/**
	 * Set the content to the editor after receiving the note data
	 */
	$effect(() => {
		if ($noteQuery.isSuccess) {
			secretKeyManagement.getSecretKey().then(async (secretKey) => {
				if (!secretKey) {
					toastStore.setError({ message: 'Secret key not found. Please sign in again!' });

					return;
				}

				const rawSecretKey = await keyManagement.importKey(secretKey);

				const content = await noteManagement.decrypt(
					$noteQuery.data.payload.note.content,
					rawSecretKey,
					$noteQuery.data.payload.note.iv,
				);

				originalData = content;
				$editor?.commands.setContent(content);
			});
		}
	});

	$effect(() => {
		editor = createEditor({
			element: editorElement,
			editorProps: {
				attributes: {
					class: 'pt-2 pb-14 outline-none min-h-[50lvh]',
				},
			},
			editable: false,
			content: `<p>Loading...</p>`,
		});

		return () => {
			$editor?.destroy();
		};
	});
</script>

<svelte:head>
	<title>Take notes</title>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
	/>
</svelte:head>

<main class="px-5 pb-24 pt-24">
	{#if $editor}
		<Header
			title="Take notes"
			editorInstance={$editor}
			mode="edit"
			disabled={$noteMutation.isPending || $noteQuery.isPending}
			{onsave}
			{originalData}
		/>
	{/if}

	<div bind:this={editorElement}></div>

	{#if $editor}
		<Controller editorInstance={$editor} />
	{/if}
</main>
