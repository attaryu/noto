<script lang="ts">
	import type { INote, INotesResponse } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { ArrowRight, RefreshCw } from 'lucide-svelte';

	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import LoadMoreInformation from '$lib/components/LoadMoreInformation.svelte';
	import NoteCard from '$lib/components/NoteCard.svelte';
	import Searchbar from '$lib/components/Searchbar.svelte';
	import Text from '$lib/components/Text.svelte';

	import noteManagement from '$lib/business/noteManagement';
	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import keyManagement from '$lib/utils/cryptography/keyManagement';
	import { stichSearchParam } from '$lib/utils/stichSearchParam';

	const toastStore = getToastStoreContext();

	let notes = $state.raw<INote[] | null>();
	let isProcessing = $state(true);
	let search = $state('');

	const archivedNotesQuery = $derived(
		createInfiniteQuery<INotesResponse, IErrorResponseAPI>({
			queryKey: ['notes', 'archive', 'list', search],
			queryFn: async ({ pageParam }) => {
				isProcessing = true;

				const query: Record<string, string> = {
					archived: 'true',
				};

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
		if ($archivedNotesQuery.isSuccess) {
			secretKeyManagement.getSecretKey().then(async (secretKey) => {
				if (!secretKey) {
					toastStore.set({
						message: 'Secret key is not found, please sign in again',
						type: 'error',
					});

					return;
				}

				const userSecretKey = await keyManagement.importKey(secretKey);

				const processedNotes = await Promise.all(
					$archivedNotesQuery.data.pages.map((page) =>
						Promise.all(
							page.payload.notes.map(async (note) => ({
								...note,
								content: JSON.stringify(
									await noteManagement.decrypt(note.content, userSecretKey, note.iv),
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
	<title>Archived Note</title>
</svelte:head>

<Header>
	<Searchbar class="w-full rounded-full" bind:value={search} />
</Header>

<main class="relative px-4 pb-24 pt-16">
	<section class="mt-4">
		{#if $archivedNotesQuery.isPending}
			<div class="grid h-[70dvh] place-items-center">
				<Text tag="p">Loading...</Text>
			</div>
		{:else if $archivedNotesQuery.isError}
			<div class="grid h-[70dvh] place-items-center">
				<Text tag="p">Error: {$archivedNotesQuery.error.error.message}</Text>
			</div>
		{:else if $archivedNotesQuery.isSuccess && notes && notes.length}
			<!-- notes list -->
			<ul class="flex flex-col gap-4">
				{#each notes as data, index (data.id)}
					<li>
						<NoteCard {data} {index} />
					</li>
				{/each}
			</ul>

			<!-- load more state information -->
			<LoadMoreInformation {isProcessing} query={$archivedNotesQuery} archivedNotes />
		{:else}
			<!-- empty notes -->

			<div class="flex h-[70dvh] flex-col items-center justify-center gap-2">
				<Text tag="h1" styling="h3">You haven't made any archived notes</Text>

				<a href="/app/notes" class="flex items-center gap-1 underline opacity-60">
					Archive a new one <ArrowRight size={16} />
				</a>
			</div>
		{/if}
	</section>
</main>
