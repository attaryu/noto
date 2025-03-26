<script lang="ts">
	import type { INote, INotesResponse } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';
	import type { PageProps } from './$types';

	import { createInfiniteQuery } from '@tanstack/svelte-query';

	import Header from '$lib/components/Header.svelte';
	import NoteCard from '$lib/components/NoteCard.svelte';
	import Searchbar from '$lib/components/Searchbar.svelte';

	import noteManagement from '$lib/business/noteManagement';
	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import Text from '$lib/components/Text.svelte';
	import keyManagement from '$lib/utils/cryptography/keyManagement';
	import { stichSearchParam } from '$lib/utils/stichSearchParam';
	import Button from '$lib/components/Button.svelte';
	import { ArrowRight, RefreshCcw } from 'lucide-svelte';
	import LoadMoreInformation from '$lib/components/LoadMoreInformation.svelte';

	const { data }: PageProps = $props();

	let notes = $state.raw<INote[] | null>();
	let isProcessing = $state(true);
	let search = $state('');

	const notesQuery = $derived(
		createInfiniteQuery<INotesResponse, IErrorResponseAPI>({
			queryKey: ['notes', 'list', search],
			queryFn: async ({ pageParam }) => {
				isProcessing = true;

				const query: Record<string, string> = {};

				if (search.length) {
					const index = await noteManagement.textIndexing(search);
					query.search = JSON.stringify(index);
				}

				if (pageParam) {
					query.offset = pageParam.toString();
				}

				return axiosFetch.GET(stichSearchParam('/notes', query));
			},
			initialPageParam: 0,
			getNextPageParam: (lastPage) =>
				lastPage.pagination!.offset < lastPage.pagination!.total
					? lastPage.pagination!.offset
					: undefined,
		}),
	);

	/**
	 * This effect will be triggered when the notes query is successful
	 * It will decrypt the notes content
	 */
	$effect(() => {
		if ($notesQuery.isSuccess && data.secretKey) {
			keyManagement.importKey(data.secretKey).then(async (secretKey) => {
				const processedNotes = await Promise.all(
					$notesQuery.data.pages.map((page) =>
						Promise.all(
							page.payload.notes.map(async (note) => ({
								...note,
								content: JSON.stringify(
									await noteManagement.decrypt(note.content, secretKey, note.iv),
								),
							})),
						),
					),
				);

				notes = processedNotes.flat(); // need to be flat because the notes is an array of array
				isProcessing = false;
			});
		}
	});
</script>

<svelte:head>
	<title>Notes</title>
</svelte:head>

<Header>
	<Searchbar class="w-full rounded-full" bind:value={search} />
</Header>

<main class="relative px-4 pb-24 pt-16">
	<section class="mt-4 space-y-4">
		{#if $notesQuery.isLoading}
			<div class="grid h-[70dvh] place-items-center">
				<Text tag="p">Loading...</Text>
			</div>
		{:else if $notesQuery.isError}
			<div class="grid h-[70dvh] place-items-center">
				<Text tag="p">Error: {$notesQuery.error.error.message}</Text>
			</div>
		{:else if $notesQuery.isSuccess && notes && notes.length}
			<!-- notes list -->
			<ul class="flex flex-col gap-4">
				{#each notes as data, index (data.id)}
					<li>
						<NoteCard {data} {index} />
					</li>
				{/each}
			</ul>

			<!-- load more state information -->
			<LoadMoreInformation {isProcessing} query={$notesQuery} />
		{:else}
			<!-- empty notes -->

			<div class="flex h-[70dvh] flex-col items-center justify-center gap-2">
				<Text tag="h1" styling="h3">You haven't made any notes</Text>

				<a href="/app/notes/create" class="flex items-center gap-1 underline opacity-60">
					Let's create a new one <ArrowRight size={16} />
				</a>
			</div>
		{/if}
	</section>
</main>
