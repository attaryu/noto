<script lang="ts">
	/**
	 * What makes it complicated?
	 * the property of m from paraglide like:
	 * - privacy_policy_page.content_1.texts.1
	 * - privacy_policy_page.content_1.texts.2.a
	 * - privacy_policy_page.content_1.texts.2.b
	 * - privacy_policy_page.content_1.texts.2.c
	 * - privacy_policy_page.content_1.texts.2.d
	 * - privacy_policy_page.content_1.texts.3
	 * - privacy_policy_page.content_1.title
	 * - privacy_policy_page.content_2.texts.1
	 * - privacy_policy_page.content_2.texts.2.a
	 * - privacy_policy_page.content_2.texts.2.b
	 * - privacy_policy_page.content_2.texts.2.c
	 * - privacy_policy_page.content_2.texts.3
	 * - privacy_policy_page.content_2.title
	 *
	 * we should able to recognize the pattern and make change them like
	 * [
	 * 	{
	 * 		title: string,
	 * 		texts: [1, [a, b, c, ...], 3, ...],
	 * 	},
	 * 	...
	 * ]
	 * 
	 * 
	 * left problems:
	 * - can't handle property which required parameter
	 */

	import { Toc } from '@svelte-put/toc';
	import { m } from 'paraglide/messages';
	import TableOfContents from '@lucide/svelte/icons/table-of-contents';

	import Text from './Text.svelte';
	import * as DropdownMenu from '$lib/components/shadcn/ui/dropdown-menu';
	import Button from './Button.svelte';

	import mergeClass from '$lib/utils/merge';

	interface Props {
		class?: string;
		propertyRoot: string;
	}

	interface TemporaryContent {
		title: string;
		texts: (string | string[])[];
	}

	const { class: className, propertyRoot }: Props = $props();

	const contents = $derived.by(() => {
		const getText = (property: string): string =>
			(m as unknown as Record<string, () => string>)[property]();

		const result = [];

		let temporaryContent: TemporaryContent = {
			title: '',
			texts: [],
		};

		let contentIndex = 1;
		let textIndex = 1;

		// iterate through texts of the content
		while (
			Object.hasOwn(m, `${propertyRoot}.content_${contentIndex}.texts.${textIndex}`) ||
			Object.hasOwn(m, `${propertyRoot}.content_${contentIndex}.texts.${textIndex}.a`)
		) {
			const root = `${propertyRoot}.content_${contentIndex}.texts.${textIndex}`;

			// assign title if it is not already set
			if (!temporaryContent.title) {
				temporaryContent.title = getText(`${propertyRoot}.content_${contentIndex}.title`);
			}

			if (
				// if the property is a simple text, we will push it.
				Object.hasOwn(m, root)
			) {
				temporaryContent.texts.push(getText(root));
			} else if (
				/**
				 * if the property has a sub-property like "a", "b", "c" then it is a list.
				 * we will iterate through the list and push it to the texts array.
				 */
				Object.hasOwn(m, `${root}.a`)
			) {
				const temporaryList: string[] = [];

				let listIndex = 97; // ASCII code for 'a'

				// iterate through the list until we reach the end of the list
				while (Object.hasOwn(m, `${root}.${String.fromCharCode(listIndex)}`)) {
					temporaryList.push(getText(`${root}.${String.fromCharCode(listIndex)}`));
					listIndex++;
				}

				temporaryContent.texts.push(temporaryList);
			}

			const nextText = Object.hasOwn(
				m,
				`${propertyRoot}.content_${contentIndex}.texts.${++textIndex}`,
			);

			const nextList = Object.hasOwn(
				m,
				`${propertyRoot}.content_${contentIndex}.texts.${textIndex}.a`,
			);

			/**
			 * if there is no text or list in the next index, it means we reached the end of the
			 * current content. so we push the current temporaryContent to the result, reset
			 * textIndex to 1, increment contentIndex and reset temporaryContent for the next content.
			 */
			if (!nextList && !nextText) {
				result.push(temporaryContent);

				temporaryContent = {
					title: '',
					texts: [],
				};

				textIndex = 1;
				contentIndex++;
			}
		}

		return result;
	});

	const toc = new Toc({
		observe: true,
		scrollMarginTop: '25vh',
		anchor: false,
	});
</script>

<div
	use:toc.actions.root
	class={mergeClass(
		'md:rounded-t-[48px bg-white md:grid md:grid-cols-[2fr_1fr] md:gap-8 lg:grid-cols-[3fr_1fr] xl:gap-12 xl:rounded-t-[64px]',
		className,
	)}
>
	<div class="space-y-6">
		<!-- main content -->
		{#each contents as content (content.title)}
			<section>
				<Text tag="h2" class="mb-3 leading-tight">{content.title}</Text>

				{#each content.texts as text (text.toString())}
					{#if Array.isArray(text)}
						<ul class="mb-2 list-inside list-disc space-y-1 pl-3">
							{#each text as listItem (listItem)}
								<li class="ml-5 -indent-5 text-zinc-700">{listItem}</li>
							{/each}
						</ul>
					{:else}
						<Text class="mb-2 leading-relaxed">{text}</Text>
					{/if}
				{/each}
			</section>
		{/each}
	</div>

	<div>
		<!-- table of content -->
		<div class="md:sticky md:top-32">
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
										class="text-zinc-700 transition-all duration-200 data-[toc-link-active]:pl-2 data-[toc-link-active]:text-zinc-800 data-[toc-link-active]:underline"
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
					<Text styling="h3" class="mb-3">Table of Contents</Text>

					<ul class="space-y-2">
						{#each toc.items.values() as item (item.id)}
							<li>
								<!-- svelte-ignore a11y_missing_attribute -->
								<a
									use:toc.actions.link={item}
									class="text-zinc-700 transition-all duration-200 data-[toc-link-active]:pl-2 data-[toc-link-active]:text-zinc-800 data-[toc-link-active]:underline"
								>
									<!-- text injected by toc -->
								</a>
							</li>
						{/each}
					</ul>
				</aside>
			{/if}
		</div>
	</div>
</div>
