<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';

	import dayjs from 'dayjs';
	import { Ellipsis, Pin, PinOff } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import createEditor from '$lib/utils/editor';
	import Button from './Button.svelte';
	import Card from './Card.svelte';
	import Dropdown from './Dropdown.svelte';

	type Props = {
		data: {
			id: number;
			label: string;
			updateAt: Date;
			pin: boolean;
			color: 'yellow' | 'green' | 'white';
			archived: boolean;
			note: {
				type: string;
				content: {
					type: string;
					content: (
						| {
								type: string;
								text: string;
								marks?: undefined;
						  }
						| {
								type: string;
								marks: {
									type: string;
								}[];
								text: string;
						  }
					)[];
				}[];
			};
		};
	};

	const { data }: Props = $props();

	const cardShadow =
		data.color === 'yellow'
			? 'shadow-tertiary-1/50'
			: data.color === 'green'
				? 'shadow-tertiary-2/50'
				: '';

	const date = data.updateAt.toLocaleDateString();

	let displayElement: HTMLDivElement;
	let editor = $state() as Readable<Editor>;

	onMount(() => {
		editor = createEditor({
			element: displayElement,
			editable: false,
			content: {
				...data.note,
				content: data.note.content.slice(0, 2),
			},
		});
	});
</script>

<Card
	color={data.archived ? 'white' : data.color}
	class="{data.archived ? 'bg-zinc-100' : cardShadow} p-4 shadow-md"
>
	{#snippet as(props)}
		<div {...props}>
			<div bind:this={displayElement}></div>

			<div class="flex items-end gap-2">
				<time datetime={date} class="w-full opacity-50">
					{dayjs(date).format('MMMM D, YYYY')}
				</time>

				{#if !data.archived}
					{#if data.pin}
						<Button variant="primary" class="p-2">
							<Pin size={20} />
						</Button>
					{:else}
						<Button variant="secondary" class="bg-transparent p-2">
							<PinOff size={20} />
						</Button>
					{/if}
				{/if}

				<Dropdown
					class="p-2"
					items={[
						{
							title: 'Detail',
							action: () => {},
						},
						{
							title: 'Edit',
							action: () => {},
						},
						{
							title: 'Archive',
							action: () => {},
						},
					]}
				>
					{#snippet placeholder()}
						<Ellipsis size={20} />
					{/snippet}
				</Dropdown>
			</div>
		</div>
	{/snippet}
</Card>
