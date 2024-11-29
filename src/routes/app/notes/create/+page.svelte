<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';

	import { onMount } from 'svelte';

	import Controller from '$lib/components/Editor/Controller.svelte';
	import Header from '$lib/components/Editor/Header.svelte';
	import Text from '$lib/components/Text.svelte';
	import createEditor from '$lib/utils/editor';

	let editorElement: HTMLDivElement;

	let label: string | null = $state(null);
	let data: any = $state.raw('');

	let editor = $state() as Readable<Editor>;

	onMount(() => {
		const meta = document.querySelector('meta[name="viewport"]');

		if (meta) {
			const contentAttribute = meta.getAttribute('content')!;
			meta.setAttribute('content', contentAttribute + ', interactive-widget=resizes-content');
		}

		editor = createEditor({
			element: editorElement,
			editorProps: {
				attributes: {
					class: 'mt-4 outline-none',
				},
			},
			content: data ?? '',
		});
	});
</script>

<svelte:head>
	<title>Take notes</title>
</svelte:head>

<main class="px-5 pb-24 pt-24">
	{#if $editor}
		<Header editorInstance={$editor} title="Take notes" originalData={data} />
	{/if}

	<input
		type="text"
		placeholder="Write the labels..."
		class="peer outline-none"
		bind:value={label}
		disabled={!$editor?.isEditable}
	/>

	<Text tag="small" class="mb-1 hidden italic opacity-60 peer-focus:inline-block">
		Make sure to separate the label with a comma!
	</Text>

	<div bind:this={editorElement}></div>

	{#if $editor}
		<Controller editorInstance={$editor} />
	{/if}
</main>
