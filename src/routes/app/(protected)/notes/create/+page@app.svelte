<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';

	import Controller from '$lib/components/Editor/Controller.svelte';
	import Header from '$lib/components/Editor/Header.svelte';
	import createEditor from '$lib/utils/editor';

	let editorElement: HTMLDivElement;
	let editor = $state.raw<Readable<Editor>>();

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
		<Header editorInstance={$editor} title="Take notes" />
	{/if}

	<div bind:this={editorElement}></div>

	{#if $editor}
		<Controller editorInstance={$editor} />
	{/if}
</main>
