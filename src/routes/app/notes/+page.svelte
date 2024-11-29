<script lang="ts">
	import Text from '$lib/components/Text.svelte';

	const availableLinks = [
		{
			title: 'Sign in',
			url: '/sign-in',
		},
		{
			title: 'Sign up',
			url: '/sign-up',
		},
		{
			title: 'Create note',
			url: '/notes/create',
		},
	];
</script>

<main class="p-4">
	<Text tag="h1">Hello Attar!</Text>

	<Text class="mt-4">Test link</Text>
	<ul class="mt-2 flex list-disc flex-col pl-8">
		{#each availableLinks as link (link.url)}
			<li>
				<Text>
					{#snippet as(props?: any)}
						<a href="/app{link.url}" {...props}>{link.title}</a>
					{/snippet}
				</Text>
			</li>
		{/each}
	</ul>
</main>
