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
	<nav class="mx-auto flex min-h-12 max-w-[440px] items-center justify-between">
		<div class="flex h-full w-fit max-w-56 items-center gap-2 rounded-full bg-zinc-800 p-1">
			{#each links as link (link.pathname)}
				{@const Icon = link.icon}
				{@const isActive = link.pathname === page.url.pathname}

				<a
					href={link.pathname}
					class="p-3 transition-all rounded-full grid place-items-center {isActive
						? 'bg-tertiary-1 hover:bg-tertiary-1 w-32 text-zinc-800'
						: 'text-white'}"
				>
					<Icon size={26} />
				</a>
			{/each}
		</div>

		<Button size="icon" class="p-3">
			{#snippet as(props: any)}
				<a href="/app/notes/create" {...props}>
					<Plus size={26} />
				</a>
			{/snippet}
		</Button>
	</nav>
</div>
