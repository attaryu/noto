<script lang="ts">
	import { page } from '$app/state';
	import { Archive, Settings, Plus, StickyNote } from 'lucide-svelte';

	import Button from '$lib/components/Button.svelte';

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
			icon: Settings,
			pathname: '/app/settings',
		},
	];
</script>

<div class="fixed inset-x-0 bottom-0 bg-linear-to-b from-transparent to-white px-4 pb-4">
	<nav class="flex max-w-[440px] mx-auto min-h-12 items-center justify-between">
		<div class="flex h-full w-56 items-center gap-2 rounded-full bg-zinc-900 p-1">
			{#each links as link (link.pathname)}
				{@const Icon = link.icon}
				{@const isActive = link.pathname === page.url.pathname}

				<Button class="transition-all {isActive && 'w-full bg-tertiary-1 text-zinc-900'}">
					{#snippet as(props: any)}
						<a href={link.pathname} {...props}>
							<Icon size={26} />
						</a>
					{/snippet}
				</Button>
			{/each}
		</div>

		<Button>
			{#snippet as(props: any)}
				<a href="/app/notes/create" {...props}>
					<Plus size={26} />
				</a>
			{/snippet}
		</Button>
	</nav>
</div>
