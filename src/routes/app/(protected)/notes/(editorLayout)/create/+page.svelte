<script lang="ts">
	import type { InfiniteData } from '@tanstack/svelte-query';
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';
	import type { PageProps } from './$types';

	import type { INotePayload, INoteResponse, INotesResponse } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Controller from '$lib/components/Editor/Controller.svelte';
	import Header from '$lib/components/Editor/Header.svelte';

	import noteManagement from '$lib/business/noteManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import keyManagement from '$lib/utils/cryptography/keyManagement';
	import createEditor from '$lib/utils/editor';
	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	const { data }: PageProps = $props();

	const toastStore = getToastStoreContext();
	const queryClient = useQueryClient();

	let editorElement = $state<HTMLDivElement>();
	let editor = $state.raw<Readable<Editor>>();

	const noteMutation = createMutation<INoteResponse, IErrorResponseAPI, INotePayload>({
		mutationFn: (payload) => axiosFetch.POST('/notes', payload),
		onSuccess: (response) => {
			/**
			 * Updating the notes list cache
			 *
			 * Since the notes list is descending, the first page will always be the latest note or
			 * pinned note. Always reset the page params
			 */
			queryClient.setQueriesData<InfiniteData<INotesResponse>>(
				{ queryKey: ['notes', 'list'] },
				(oldData) => {
					if (!oldData) return;

					const [firstPage] = oldData.pages;
					const pinnedNote = firstPage.payload.notes.filter(({ pinned }) => pinned);

					const updatedFirstPageInformation: INotesResponse['pagination'] = {
						...firstPage.pagination!,
						total: firstPage.pagination!.total + 1,
					};

					const pageParams = oldData.pageParams.slice(0, 1);

					// update the page information of first page if the pinned notes length is more than 10
					if (pinnedNote.length >= 10) {
						return {
							pageParams,
							pages: [
								{
									...firstPage,
									pagination: updatedFirstPageInformation,
								},
							],
						};
					}

					// add the new note to below the pinned note as the latest note
					const newNotes = [
						...pinnedNote,
						response.payload.note,
						...firstPage.payload.notes.filter(({ pinned }) => !pinned),
					];

					// remove the last note if the notes length is more than the limit
					if (newNotes.length > firstPage.pagination!.limit) {
						newNotes.pop();
					}

					return {
						pageParams,
						pages: [
							{
								...firstPage,
								pagination: updatedFirstPageInformation,
								payload: {
									...firstPage.payload,
									notes: newNotes,
								},
							},
						],
					};
				},
			);

			queryClient.setQueryData(['notes', 'detail', response.payload.note.id], response);

			$editor?.commands.clearContent();
			$editor?.setEditable(true);

			toastStore.setSuccess({
				message: 'Note saved',
				action: {
					title: 'View note',
					event: () => goto(`/app/notes/${response.payload.note.id}`),
				},
			});
		},
		onError: (error) => {
			toastStore.setError(generateToastHTTPError(error, { title: 'Retry', event: onsave }));
		},
	});

	async function onsave() {
		if (!$editor || $editor.isEmpty) {
			toastStore.setError({ message: 'Note cannot be empty' });

			return;
		}

		if (data.secretKey) {
			const rawSecretKey = await keyManagement.importKey(data.secretKey);
			const payload = await noteManagement.processContent($editor.getJSON(), rawSecretKey);

			$noteMutation.mutate({
				...payload,
				labels: [], // label feature not implemented yet
			});
		}
	}

	$effect(() => {
		editor = createEditor({
			element: editorElement,
			editorProps: {
				attributes: {
					class: 'pt-2 pb-14 outline-none min-h-[50lvh]',
				},
			},
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
			mode="create"
			title="Take notes"
			editorInstance={$editor}
			disabled={$noteMutation.isPending}
			{onsave}
		/>
	{/if}

	<div bind:this={editorElement}></div>

	{#if $editor}
		<Controller editorInstance={$editor} />
	{/if}
</main>
