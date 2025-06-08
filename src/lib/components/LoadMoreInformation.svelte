<script lang="ts" generics="Response extends INotesResponse, Error">
	import type {
		InfiniteData,
		InfiniteQueryObserverPlaceholderResult,
		InfiniteQueryObserverSuccessResult,
	} from '@tanstack/svelte-query';

	import type { INotesResponse } from '$lib/types/api/notes';

	import { m } from 'paraglide/messages';

	import Button from './Button.svelte';
	import Text from './Text.svelte';

	interface Props {
		query:
			| InfiniteQueryObserverPlaceholderResult<InfiniteData<Response>, Error>
			| InfiniteQueryObserverSuccessResult<InfiniteData<Response>, Error>;
		isProcessing: boolean;
	}

	const { query, isProcessing }: Props = $props();

	const notesInformation = $derived({
		total: query.data?.pages[0].pagination?.total ?? 0,
		loaded: query.data?.pages[query.data.pages.length - 1].pagination?.offset ?? 0,
	});

	const isLoading = $derived(query.isFetchingNextPage || isProcessing);
</script>

<!-- load more state information -->
{#if query.hasNextPage}
	<div class="flex h-28 flex-col items-center justify-end gap-2">
		<Text tag="small">
			{m['loadmore_component.have_next_page'](notesInformation)}
		</Text>

		<Button
			variant="secondary"
			class="w-full"
			disabled={isLoading}
			onclick={() => query.fetchNextPage()}
		>
			{isLoading ? `${m['common.loading']()}...` : m['loadmore_component.cta']()}
		</Button>
	</div>
{:else}
	<Text tag="small" class="pt-6 text-center">
		{m['loadmore_component.dont_have_next_page']({ total: notesInformation.total })}
	</Text>
{/if}
