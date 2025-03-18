<script lang="ts" generics="Response extends INotesResponse, Error">
	import type {
		InfiniteData,
		InfiniteQueryObserverPlaceholderResult,
		InfiniteQueryObserverSuccessResult,
	} from '@tanstack/svelte-query';

	import type { INotesResponse } from '$lib/types/api/notes';

	import Button from './Button.svelte';
	import Text from './Text.svelte';

	interface Props {
		query:
			| InfiniteQueryObserverPlaceholderResult<InfiniteData<Response>, Error>
			| InfiniteQueryObserverSuccessResult<InfiniteData<Response>, Error>;
		isProcessing: boolean;
		archivedNotes?: boolean;
	}

	const { query, isProcessing, archivedNotes }: Props = $props();

	const notesInformation = $derived({
		total: query.data?.pages[0].pagination?.total ?? 0,
		loaded: query.data?.pages[query.data.pages.length - 1].pagination?.offset ?? 0,
	});

	const isLoading = $derived(query.isFetchingNextPage || isProcessing);
	const notesType = $derived(archivedNotes ? 'archived' : '');
</script>

<!-- load more state information -->
{#if query.hasNextPage}
	<div class="flex h-28 flex-col items-center justify-end gap-2">
		<Text tag="small">
			{notesInformation.total}{' '}
			{notesType} notes found,{' '}
			{notesInformation.loaded} loaded.
		</Text>

		<Button
			variant="secondary"
			class="w-full"
			disabled={isLoading}
			onclick={() => query.fetchNextPage()}
		>
			{isLoading ? 'Loading...' : 'Load more'}
		</Button>
	</div>
{:else}
	<Text tag="small" class="pt-6 text-center">
		{#if notesInformation.total === 1}
			1 {notesType} note loaded.
		{:else}
			All {notesInformation.total} {notesType} notes loaded.
		{/if}
	</Text>
{/if}
