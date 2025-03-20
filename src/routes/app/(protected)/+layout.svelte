<script lang="ts">
	import type { LayoutProps } from './$types';

	import Navigation from '$lib/components/Navigation.svelte';

	import { setUserStore } from '$lib/stores/user.svelte';
	import { makeUserImageProfile } from '$lib/utils/makeUserImageProfile';

	let { children, data }: LayoutProps = $props();

	setUserStore({
		id: data.user.id!,
		fullname: data.user.fullname,
		email: data.user.email,
		image: makeUserImageProfile(data.user.fullname),
		secretKey: data.user.secretKey!,
	});
</script>

{@render children?.()}

<Navigation />
