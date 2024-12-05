<script lang="ts">
	import { Archive, CircleUserRound, Plus, StickyNote } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Button from '$lib/components/Button.svelte';

	let activePathname = $state('');

	const links = [
		{
			icon: StickyNote,
			pathname: '/app/notes',
		},
		{
			icon: Archive,
			pathname: '/app/notes/archive',
		},
		{
			icon: CircleUserRound,
			pathname: '/app/profile',
		},
	];

	onMount(() => {
		activePathname = $page.url.pathname;
	});
</script>

<div class="fixed inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white px-4 pb-4">
	<nav class="flex min-h-12 items-center justify-between">
		<div class="flex h-full w-fit items-center gap-2 rounded-full bg-zinc-900 p-1">
			{#key activePathname}
				{#each links as link}
					{@const Icon = link.icon}
					{@const isActive = link.pathname === activePathname}

					<Button
						class="transition-all {isActive && 'w-[30vw] bg-tertiary-1 text-zinc-900'}"
						onclick={() => (activePathname = link.pathname)}
					>
						{#snippet as(props)}
							<a href={link.pathname} {...props}>
								<Icon size={26} />
							</a>
						{/snippet}
					</Button>
				{/each}
			{/key}
		</div>

		<Button>
			{#snippet as(props)}
				<a href="/app/notes/create" {...props}>
					<Plus size={26} />
				</a>
			{/snippet}
		</Button>
	</nav>
</div>
