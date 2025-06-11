<script lang="ts">
	import type { JSONContent } from '@tiptap/core';

	import type { INote, INoteResponse } from '$lib/types/api/notes';
	import type { IErrorResponseAPI } from '$lib/types/response';

	import { goto } from '$app/navigation';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Pin from '@lucide/svelte/icons/pin';
	import PinOff from '@lucide/svelte/icons/pin-off';
	import { m } from 'paraglide/messages';
	import { get } from 'svelte/store';
	import 'dayjs/locale/id';

	import Button from './Button.svelte';
	import Card from './Card.svelte';
	import * as DropdownMenu from './shadcn/ui/dropdown-menu';

	import { axiosFetch } from '$lib/stores/api/baseConfig';
	import { getToastStoreContext } from '$lib/stores/toast.svelte';

	import createEditor from '$lib/utils/editor';
	import { generateToastHTTPError } from '$lib/utils/toastMessage';

	type Props = {
		data: INote;
		index: number;
	};

	dayjs.extend(relativeTime);

	const { data, index }: Props = $props();
	const toastStore = getToastStoreContext();
	const queryClient = useQueryClient();

	let displayElement = $state<HTMLDivElement>();

	const noteMutation = createMutation<
		INoteResponse,
		IErrorResponseAPI,
		{ pinned?: boolean; archived?: boolean }
	>({
		mutationKey: ['notes', 'detail', data.id],
		mutationFn: (payload) => axiosFetch.PATCH(`/notes/${data.id}`, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['notes', 'list'],
				type: 'all',
				refetchType: 'all',
			});

			queryClient.invalidateQueries({
				queryKey: ['notes', 'archive', 'list'],
				type: 'all',
				refetchType: 'all',
			});
		},
	});

	const color = $derived((index + 1) % 2 ? 'yellow' : 'green');
	const cardShadow = $derived(color === 'yellow' ? 'shadow-tertiary-1/50' : 'shadow-tertiary-2/50');
	const updateAt = $derived(new Date(data.updatedAt).toISOString());
	const isPinned = $derived($noteMutation.variables?.pinned ?? data.pinned);
	const PinIcon = $derived(isPinned ? Pin : PinOff);

	function updatePin() {
		$noteMutation.mutate(
			{ pinned: !data.pinned },
			{
				onSuccess: (response) => {
					toastStore.setSuccess({
						message: m['note_card_component.toast.pinned_success']({
							pinned: response.payload.note.pinned.toString(),
						}),
						action: {
							title: m['common.toast.undo'](),
							event: () => $noteMutation.mutate({ pinned: !response.payload.note.pinned }),
						},
					});
				},
				onError: (error) => {
					toastStore.setError(
						generateToastHTTPError(error, { title: m['common.toast.retry'](), event: updatePin }),
					);
				},
			},
		);
	}

	function updateArchived() {
		$noteMutation.mutate(
			{ archived: !data.archived },
			{
				onSuccess: (response) => {
					toastStore.setSuccess({
						message: m['note_card_component.toast.archived_success']({
							archived: response.payload.note.archived.toString(),
						}),
						action: {
							title: m['common.toast.undo'](),
							event: () => $noteMutation.mutate({ archived: !response.payload.note.archived }),
						},
					});
				},
				onError: (error) => {
					toastStore.setError(
						generateToastHTTPError(error, {
							title: m['common.toast.retry'](),
							event: updateArchived,
						}),
					);
				},
			},
		);
	}

	$effect(() => {
		const schema = JSON.parse(data.content) as JSONContent;

		const editor = createEditor({
			element: displayElement,
			editorProps: {
				attributes: {
					class: 'max-h-64 overflow-y-hidden',
				},
			},
			editable: false,
			content: {
				...schema,
				content: schema.content!.slice(0, 2),
			},
		});

		return () => {
			get(editor).destroy();
		};
	});
</script>

<Card
	class={`p-4 shadow-md ${!data.archived && cardShadow}`}
	color={data.archived ? 'white' : color}
>
	{#snippet as(props)}
		<div {...props}>
			<div bind:this={displayElement}></div>

			<div class="mt-2 flex items-end gap-2">
				<time datetime={updateAt} class="w-full text-sm font-medium opacity-50">
					{dayjs().to(updateAt)}
				</time>

				{#if !data.archived}
					<Button
						variant={isPinned ? 'primary' : 'secondary'}
						size="icon"
						class={`${!isPinned && 'bg-transparent'}`}
						disabled={$noteMutation.isPending}
						onclick={updatePin}
					>
						<PinIcon size={20} />
					</Button>
				{/if}

				<DropdownMenu.Root>
					<Button size="icon" disabled={$noteMutation.isPending}>
						{#snippet as(props)}
							<DropdownMenu.Trigger {...props}>
								<Ellipsis size={20} />
							</DropdownMenu.Trigger>
						{/snippet}
					</Button>

					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<a href={`/app/notes/${data.id}`} class="debug w-full h-full">{m['note_card_component.dropdown.detail']()}</a>
							</DropdownMenu.Item>

							<DropdownMenu.Item onclick={updateArchived}>
								{m['note_card_component.dropdown.archive']({
									archived: data.archived.toString(),
								})}
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	{/snippet}
</Card>
