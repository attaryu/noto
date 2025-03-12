<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';

	import type { INotePayload, INoteResponse } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';

	import Controller from '$lib/components/Editor/Controller.svelte';
	import Header from '$lib/components/Editor/Header.svelte';

	import noteManagement from '$lib/business/noteManagement';
	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import keyManagement from '$lib/utils/cryptography/keyManagement';
	import createEditor from '$lib/utils/editor';

	const toastStore = getToastStoreContext();

	let editorElement: HTMLDivElement;
	let editor = $state.raw<Readable<Editor>>();

	const noteMutation = createMutation<INoteResponse, IErrorResponseAPI, INotePayload>({
		mutationFn: (payload) => axiosFetch.POST('/notes', payload),
		onSuccess: (data) => {
			toastStore.setToast({
				message: 'Note saved successfully',
				type: 'success',
			});

			goto(`/app/notes/${data.payload.note.id}`, { replaceState: true });
		},
		onError: (error) => {
			toastStore.setToast({
				message: error.error.message ?? 'An error occured',
				type: 'error',
			});
		},
	});

	async function submitHandler() {
		if (!$editor || $editor.isEmpty) {
			toastStore.setToast({
				message: 'Note cannot be empty',
				type: 'error',
			});

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
		const payload = await noteManagement.processContent($editor.getJSON(), rawSecretKey);

		$noteMutation.mutate({
			...payload,
			labels: [], // label feature not implemented yet
		});
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
		<Header editorInstance={$editor} title="Take notes" onsave={submitHandler} />
	{/if}

	<div bind:this={editorElement}></div>

	{#if $editor}
		<Controller editorInstance={$editor} />
	{/if}
</main>
