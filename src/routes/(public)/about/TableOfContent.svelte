<script lang="ts">
	import type { Toc } from '@svelte-put/toc';

	import { TableOfContents } from 'lucide-svelte';

	import Text from '$lib/components/Text.svelte';
	import Button from '$lib/components/Button.svelte';
	import * as DropdownMenu from '$lib/components/shadcn/ui/dropdown-menu';

	const { toc }: { toc: Toc } = $props();
</script>

{#if toc.items.size}
	<!-- small screen navigation -->
	<DropdownMenu.Root>
		<!-- just need hidden the trigger button -->
		<Button
			size="icon"
			class="fixed right-4 bottom-4 z-50 border border-white p-2 md:invisible md:hidden"
		>
			{#snippet as(props: any)}
				<DropdownMenu.Trigger {...props}>
					<TableOfContents size={32} />
				</DropdownMenu.Trigger>
			{/snippet}
		</Button>

		<DropdownMenu.Content align="end" class="rounded-xl border border-zinc-500">
			<DropdownMenu.Group>
				<DropdownMenu.Label>Table of Contents</DropdownMenu.Label>

				<DropdownMenu.Separator class="bg-zinc-500" />

				{#each toc.items.values() as item (item.id)}
					<!-- svelte-ignore a11y_missing_attribute -->
					<DropdownMenu.Item class="rounded-lg">
						<a
							use:toc.actions.link={item}
							class="data-[toc-link-active]:text-zinc-800 data-[toc-link-active]:underline xl:text-lg"
						>
							<!-- text injected by toc -->
						</a>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- medium screen or higher -->
	<aside class="invisible hidden rounded-xl border border-zinc-500 p-4 md:visible md:block">
		<Text class="mb-3 text-lg font-semibold">Table of Contents</Text>

		<ul class="space-y-2">
			{#each toc.items.values() as item (item.id)}
				<li class="ml-4">
					<!-- svelte-ignore a11y_missing_attribute -->
					<a
						use:toc.actions.link={item}
						class="text-zinc-600 data-[toc-link-active]:text-zinc-800 data-[toc-link-active]:underline"
					>
						<!-- text injected by toc -->
					</a>
				</li>
			{/each}
		</ul>
	</aside>
{/if}
