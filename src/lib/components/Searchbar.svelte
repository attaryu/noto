<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { Search } from 'lucide-svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import Input from './Input.svelte';

	type Props = {
		class?: string;
		placeholder?: string;
		value?: string;
	};

	let { class: className, value = $bindable(), placeholder = 'Search' }: Props = $props();

	const KEY = 'search';
	const searchParams = new SvelteURLSearchParams($page.url.search);

	function replaceSearchParamsOnURL() {
		if (searchParams.has(KEY)) {
			replaceState(`?${searchParams.toString()}`, {});
		} else {
			replaceState($page.url.pathname, {});
		}
	}

	function onChangeHandler(event: EventParameter<Event, HTMLInputElement>) {
		const { value } = event.currentTarget;

		if (value) {
			searchParams.set(KEY, value);
		} else {
			searchParams.delete(KEY);
		}

		replaceSearchParamsOnURL();
	}

	$effect(() => {
		value = searchParams.get(KEY) ?? '';
	});
</script>

<Input {placeholder} type="text" class={className} {value} oninput={onChangeHandler}>
	{#snippet icon(props)}
		<Search {...props} />
	{/snippet}
</Input>
