import { goto } from '$app/navigation';

import { createMutation } from '$lib/hooks/createMutation.svelte';
import { axiosFetch } from '$lib/stores/api/baseConfig';

export function profileController() {
	const logOutMutation = createMutation({
		mutationFn: async () => axiosFetch.DELETE('/auth/sign-out'),
		onSettled: () => {
			goto('/app/sign-in');
		},
	});

	return {
		logOutMutation,
	};
}
