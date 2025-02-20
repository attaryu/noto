<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import NoteCard from '$lib/components/NoteCard.svelte';
	import Searchbar from '$lib/components/Searchbar.svelte';
	import Text from '$lib/components/Text.svelte';

	let labels = ['Testing', 'Noto', 'Lorem', 'Ipsum', 'Dolor'];
	let notes = [
		{
			id: 1,
			label: 'Testing',
			updateAt: new Date('2024-11-01T03:41:47.977Z'),
			pin: true,
			archived: false,
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
			archived: false,
			color: 'yellow' as const,
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
	let filteredNotes = $derived(
		notes
			.filter((item) => (activeLabel ? item.label.includes(activeLabel!) : item))
			.sort((a, b) => a.updateAt.getTime() - b.updateAt.getTime())
			// <!--? pinned sorting --->
			.sort((a, b) => (a.pin ? -1 : b.pin ? 1 : 0)),
	);
</script>

<svelte:head>
	<title>Notes</title>
</svelte:head>

<Header>
	<Searchbar class="w-full rounded-full" bind:value={search} />
</Header>

<main class="relative px-4 pt-32">
	<Text tag="h1" class="text-6xl">Let's Note!</Text>

	<section>
		<Text tag="h2" class="sr-only">Labels</Text>

		<ul class="-ml-4 mt-12 flex w-dvw gap-2 overflow-x-scroll px-4">
			<li>
				{@render labelComponent(
					!activeLabel,
					`All(${notes.length})`,
					() => (activeLabel = undefined),
				)}
			</li>

			{#each labels as label}
				<li>
					{@render labelComponent(activeLabel === label, label, () => (activeLabel = label))}
				</li>
			{/each}

			{#snippet labelComponent(isActive: boolean, content: string, onclick: () => void)}
				{#key activeLabel}
					<Button variant={isActive ? 'primary' : 'secondary'} class="py-2" {onclick}>
						{content}
					</Button>
				{/key}
			{/snippet}
		</ul>
	</section>

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
