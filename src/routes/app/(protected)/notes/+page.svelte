<script lang="ts">
	import type { INote, INotesResponse } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { createQuery } from '@tanstack/svelte-query';

	import Header from '$lib/components/Header.svelte';
	import NoteCard from '$lib/components/NoteCard.svelte';
	import Searchbar from '$lib/components/Searchbar.svelte';

	import noteManagement from '$lib/business/noteManagement';
	import { secretKeyManagement } from '$lib/business/secretKeyManagement';
	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import keyManagement from '$lib/utils/cryptography/keyManagement';
	import { stichSearchParam } from '$lib/utils/stichSearchParam';

	const toastStore = getToastStoreContext();
	let userSecretKey = $state<CryptoKey>();

	let notes = $state.raw<INote[] | null>();
	let search = $state('');

	const notesQuery = $derived(
		createQuery<INotesResponse, IErrorResponseAPI>({
			queryKey: ['notes', 'list', search],
			queryFn: async () => {
				const query: Record<string, string> = {};

				if (search.length) {
					const index = await noteManagement.textIndexing(search);
					query.search = JSON.stringify(index);
				}

				return axiosFetch.GET(stichSearchParam('/notes', query));
			},
		}),
	);

	/**
	 * This effect will be triggered when the notes query is successful
	 * It will decrypt the notes content
	 */
	$effect(() => {
		if ($notesQuery.isSuccess) {
			secretKeyManagement.getSecretKey().then(async (secretKey) => {
				if (!secretKey) {
					toastStore.setToast({
						message: 'Secret key is not found, please sign in again',
						type: 'error',
					});

					return;
				}

				userSecretKey = await keyManagement.importKey(secretKey);

				const processedNotes = await Promise.all(
					$notesQuery.data.payload.notes.map(async (note) => {
						return {
							...note,
							content: JSON.stringify(
								await noteManagement.decrypt(note.content, userSecretKey!, note.iv),
							),
						};
					}),
				);

				notes = processedNotes;
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

<main class="relative px-4 pb-32 pt-16">
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

	<section class="mt-4">
		{#if notes && notes.length}
			<ul class="flex flex-col gap-4">
				{#each notes as data, index (data.id)}
					<li>
						<NoteCard {data} {index} />
					</li>
				{/each}
			</ul>
		{:else}
			<p>There is no record</p>
		{/if}
	</section>
</main>
