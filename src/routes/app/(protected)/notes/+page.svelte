<script lang="ts">
	import type { INote, INotesResponse } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';

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
	import { ArrowRight } from 'lucide-svelte';

	const toastStore = getToastStoreContext();

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
			refetchInterval: 30000,
			initialPageParam: 0,
			getNextPageParam: (lastPage) =>
				lastPage.pagination!.offset < lastPage.pagination!.total
					? lastPage.pagination!.offset
					: undefined,
		}),
	);

	const notesInformation = $derived({
		total: $notesQuery.data?.pages[0].pagination?.total ?? 0,
		loaded: $notesQuery.data?.pages[$notesQuery.data.pages.length - 1].pagination?.offset ?? 0,
	});

	/**
	 * This effect will be triggered when the notes query is successful
	 * It will decrypt the notes content
	 */
	$effect(() => {
		if ($notesQuery.isSuccess) {
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
					$notesQuery.data.pages.map((page) =>
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
	<title>Notes</title>
</svelte:head>

<Header>
	<Searchbar class="w-full rounded-full" bind:value={search} />
</Header>

<main class="relative px-4 pb-24 pt-16">
	<!-- <section>
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
		</section> -->

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
			{#if $notesQuery.hasNextPage}
				{@const isLoading = $notesQuery.isFetchingNextPage || isProcessing}

				<div class="flex h-28 flex-col items-center justify-end gap-2">
					<Text tag="small">
						{notesInformation.total} notes found,{' '}
						{notesInformation.loaded} loaded.
					</Text>

					<Button
						variant="secondary"
						class="w-full"
						disabled={isLoading}
						onclick={() => $notesQuery.fetchNextPage()}
					>
						{isLoading ? 'Loading...' : 'Load more'}
					</Button>
				</div>
			{:else}
				<Text tag="small" class="pt-6 text-center">
					{#if notesInformation.total === 1}
						1 note loaded.
					{:else}
						All {notesInformation.total} notes loaded.
					{/if}
				</Text>
			{/if}
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
