<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { IGetUserResponse } from '$lib/types/api/user';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { createQuery } from '@tanstack/svelte-query';

	import Navigation from '$lib/components/Navigation.svelte';

	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { setUserStore } from '$lib/stores/user.svelte';

	const { children }: { children?: Snippet } = $props();

	const userQuery = createQuery<IGetUserResponse, IErrorResponseAPI>({
		queryKey: ['user', 'detail'],
		queryFn: () => axiosFetch.GET('/user'),
	});

	$effect(() => {
		if ($userQuery.isSuccess) {
			setUserStore({
				id: $userQuery.data.payload.user.id,
				fullname: $userQuery.data.payload.user.fullname,
				email: $userQuery.data.payload.user.email,
			});
		}
	});
</script>

{#if $userQuery.isSuccess}
	{@render children?.()}
{/if}

<Navigation />
