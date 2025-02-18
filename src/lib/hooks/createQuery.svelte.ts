import type { IErrorResponseAPI } from '$lib/types/response';
import type { QueryObserverResult, UndefinedInitialDataOptions } from '@tanstack/svelte-query';

import { createQuery as TanstackCreateQuery } from '@tanstack/svelte-query';
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';

export function createQuery<Response>(
	options: UndefinedInitialDataOptions<
		Response | undefined,
		IErrorResponseAPI,
		Response | undefined,
		string[]
	>,
) {
	/**
	 * original query store from tanstack/svelte-query
	 */
	const queryStore = TanstackCreateQuery(options);

	/**
	 * query state value for easy reactivity
	 */
	let query = $state.raw<QueryObserverResult<Response | undefined, IErrorResponseAPI>>(
		// get query store value immediately for avoid undefined value
		get(queryStore),
	);

	const unsubscribe = queryStore.subscribe((state) => {
		// update query state value
		query = { ...state };
	});

	onDestroy(() => {
		unsubscribe();
	});

	return {
		get data() {
			return query.data;
		},

		get error() {
			return query.error;
		},

		get isSuccess() {
			return query.isSuccess;
		},

		get isError() {
			return query.isError;
		},

		get isPending() {
			return query.isPending;
		},

		get isLoading() {
			return query.isLoading;
		},

		refetch: query.refetch,
	};
}
