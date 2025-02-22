import { goto } from '$app/navigation';
import { secretKeyManagement } from '$lib/business/secretKeyManagement';

import { createMutation } from '$lib/hooks/createMutation.svelte';
import { axiosFetch } from '$lib/stores/api/baseConfig';

export function profileController() {
	const logOutMutation = createMutation({
		mutationFn: async () => axiosFetch.DELETE('/auth/sign-out'),
		onSettled: () => {
			secretKeyManagement.removeSecretKey();
			goto('/app/sign-in');
		},
	});

	return {
		logOutMutation,
	};
}
