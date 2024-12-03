<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import NoteCard from '$lib/components/NoteCard.svelte';
	import Searchbar from '$lib/components/Searchbar.svelte';
	import Text from '$lib/components/Text.svelte';

	let notes = [
		{
			id: 1,
			label: 'Testing',
			updateAt: new Date('2024-11-01T03:41:47.977Z'),
			pin: false,
			archived: true,
			color: 'green' as const,
			note: {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'This is title',
							},
						],
					},
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'And some description',
							},
							{
								type: 'text',
								marks: [
									{
										type: 'bold',
									},
								],
								text: ' ',
							},
							{
								type: 'text',
								text: 'that i need for ',
							},
							{
								type: 'text',
								marks: [
									{
										type: 'bold',
									},
								],
								text: 'testing',
							},
						],
					},
				],
			},
		},
		{
			id: 2,
			label: 'Noto',
			updateAt: new Date('2024-12-01T03:41:47.977Z'),
			pin: false,
			color: 'yellow' as const,
			archived: true,
			note: {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Wow, this editor instance exports its content as JSON.',
							},
						],
					},
				],
			},
		},
	];

	let activeLabel: string | undefined = $state();
	let search: string = $state('');
	let filteredNotes = $derived(notes.sort((a, b) => a.updateAt.getTime() - b.updateAt.getTime()));
</script>

<svelte:head>
	<title>Archive</title>
</svelte:head>

<Header>
	<Searchbar class="w-full rounded-full" bind:value={search} />
</Header>

<main class="relative px-4 pt-32">
	<Text tag="h1" class="text-6xl">Archive</Text>

	<section class="mt-4">
		{#if filteredNotes.length}
			<ul class="flex flex-col gap-4" role="list">
				{#each filteredNotes as note}
					<li>
						{#key activeLabel}
							<NoteCard data={note} />
						{/key}
					</li>
				{/each}
			</ul>
		{:else}
			<p>There is no record</p>
		{/if}
	</section>
</main>
