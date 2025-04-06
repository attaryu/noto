<script lang="ts">
	const links = [
		{
			title: 'sign in',
			url: '/sign-in',
		},
		{
			title: 'sign up',
			url: '/sign-up',
		},
		{
			title: 'recovery key',
			url: '/recovery-key',
		},
		{
			title: 'step 1',
			url: '/account-recovery/step-1',
		},
		{
			title: 'step 2',
			url: '/account-recovery/step-2',
		},
		{
			title: 'step 3',
			url: '/account-recovery/step-3',
		},
	];
</script>

<main class="space-y-4 p-4">
	<h1 class="text-xl font-semibold">Page Links</h1>

	<ul class="list-inside list-disc">
		{#each links as link}
			<li>
				<a href="/app{link.url}" class="text-blue-500 underline">{link.title}</a>
			</li>
		{/each}
	</ul>
</main>
