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
	import { schemaComparison } from '$lib/utils/schemaComparison';

	const { data }: PageProps = $props();
	const toastStore = getToastStoreContext();

	let editorElement = $state<HTMLDivElement>();
	let editor = $state.raw<Readable<Editor>>();
	let originalData = $state<JSONContent>();

	const noteMutation = createMutation<INoteResponse, IErrorResponseAPI, INoteUpdate>({
		mutationFn: (payload) => axiosFetch.PATCH(`/notes/${data.noteId}`, payload),
		onSuccess: () => {
			toastStore.setToast({
				message: 'Saved successfully',
				type: 'success',
			});
		},
		onError: (error) => {
			toastStore.setToast({
				message: error.error.message ?? 'An error occured',
				type: 'error',
			});
		},
	});

	const noteQuery = createQuery<INoteResponse, IErrorResponseAPI>({
		queryKey: ['notes', 'detail', data.noteId],
		queryFn: () => axiosFetch.GET(`/notes/${data.noteId}`),
	});

	async function onsave() {
		if (!$editor || $editor.isEmpty) {
			toastStore.setToast({
				message: 'Note cannot be empty',
				type: 'error',
			});

			return;
		}

		if (originalData && schemaComparison(originalData, $editor.getJSON())) {
			return;
		}

		const secretKey = await secretKeyManagement.getSecretKey();

		if (!secretKey) {
			toastStore.setToast({
				message: 'Secret key not found. Please sign in again!',
				type: 'error',
			});

			return;
		}

		const rawSecretKey = await keyManagement.importKey(secretKey);
		const processNote = await noteManagement.processContent(
			$editor.getJSON(),
			rawSecretKey,
			$noteQuery.data!.payload.note.iv,
		);

		$noteMutation.mutate({
			...$noteQuery.data!.payload.note,
			...processNote,
		});
	}

	/**
	 * Set the content to the editor after receiving the note data
	 */
	async function setContent(encryptedContent: string, iv: string) {
		const secretKey = await secretKeyManagement.getSecretKey();

		if (!secretKey) {
			toastStore.setToast({
				message: 'Secret key not found. Please sign in again!',
				type: 'error',
			});

			return;
		}

		const rawSecretKey = await keyManagement.importKey(secretKey);
		const content = await noteManagement.decrypt(encryptedContent, rawSecretKey, iv);

		originalData = content;
		$editor?.commands.setContent(content);
	}

	$effect(() => {
		if ($noteQuery.isSuccess) {
			const { content, iv } = $noteQuery.data.payload.note;
			setContent(content, iv);
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
		<Header title="Take notes" editorInstance={$editor} {onsave} {originalData} />
	{/if}

	<div bind:this={editorElement}></div>

	{#if $editor}
		<Controller editorInstance={$editor} />
	{/if}
</main>
