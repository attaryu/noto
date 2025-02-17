import type { CreateBaseMutationResult, CreateMutationOptions } from '@tanstack/svelte-query';

import type { IErrorResponseAPI } from '$lib/types/response';

import { createMutation as TanstackCreateMutation } from '@tanstack/svelte-query';
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';

export function createMutation<Response, Payload>(
	options: CreateMutationOptions<Response | undefined, IErrorResponseAPI, Payload, unknown>,
) {
	/**
	 * original mutation store from tanstack/svelte-query
	 */
	const mutationStore = TanstackCreateMutation(options);

	/**
	 * mutation state value for easy reactivity
	 */
	let mutation = $state.raw<
		CreateBaseMutationResult<Response | undefined, IErrorResponseAPI, Payload, unknown>
	>(
		// get mutation store value immediately for avoid undefined value
		get(mutationStore),
	);

	const unsubscribe = mutationStore.subscribe((state) => {
		// update mutation state value
		mutation = state;
	});

	onDestroy(() => {
		unsubscribe();
	});

	return {
		get data() {
			return mutation.data;
		},

		get error() {
			return mutation.error;
		},

		get isSuccess() {
			return mutation.isSuccess;
		},

		get isError() {
			return mutation.isError;
		},

		get isPending() {
			return mutation.isPending;
		},

		mutate: mutation.mutate,
		mutateAsync: mutation.mutateAsync,
	};
}
