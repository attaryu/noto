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
		const payload = await noteManagement.transform($editor.getJSON(), rawSecretKey);

		$noteMutation.mutate(payload);
	}

	$effect(() => {
		editor = createEditor({
			element: editorElement,
			editorProps: {
				attributes: {
					class: 'pt-2 pb-14 outline-none min-h-[50lvh]',
				},
			},
			content: `
				<h1>Daily Notes and Daily Motivation</h1>

				<h2>Summary of the Day</h2>
				<p><b>Date:</b> <i>March 8, 2025</i></p>
				<p>
						Today was quite a productive day. I completed some pending tasks and managed to finish
						a chapter of the book I am currently reading.
				</p>
				<p>
						And I also managed to complete the project report that I was working on for the past week.
				</p>

				<h2>Tasks Completed</h2>
				<p>Fortunately, I can complete this task as fast as possible. So, I can rest as soon 🥰</p>
				<ul>
						<li><b>Finished the project report</b></li>
						<li><i>Replied to important emails</i></li>
						<li><u>Scheduled a meeting</u></li>
				</ul>

				<h2>Goals for Tomorrow</h2>
				<ol>
						<li><b>Complete the UI design for the application</b></li>
						<li><i>Study the basics of Machine Learning</i></li>
						<li><u>Exercise for 30 minutes</u></li>
				</ol>

				<h3>Additional Notes</h3>
				<p>
						I need to be more disciplined in managing my time to avoid procrastination.
				</p>

				<h3>Today's Motivation for Me</h3>
				<p>
						<i>"Failure is part of the journey to success."</i>
				</p>
			`,
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
