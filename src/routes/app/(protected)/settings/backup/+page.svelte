<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';

	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Header from '$lib/components/Header.svelte';
	import MenuItem from '$lib/components/Profile/MenuItem.svelte';
	import Text from '$lib/components/Text.svelte';
</script>

<svelte:head>
	<title>Backup</title>
</svelte:head>

<main class="flex flex-col gap-8 px-4 pb-24 pt-24">
	<Header class="grid grid-cols-3 grid-rows-1 items-center border border-zinc-900 bg-white p-1">
		<Button onclick={() => history.back()}>
			<ArrowLeft />
		</Button>

		<Text tag="p" styling="h3" class="text-center">Backup</Text>
	</Header>

	<section class="space-y-2">
		<Text tag="h2">As File</Text>

		<Card color="green" class="p-2">
			{#snippet as(props)}
				<ul {...props}>
					<li>
						<MenuItem text="Export" type="button" action={() => {}} />
					</li>

					<li>
						<MenuItem text="Import" type="button" action={() => {}} />
					</li>
				</ul>
			{/snippet}
		</Card>
	</section>
</main>

<Decorator color="green" class="-left-0 -top-8" />
<Decorator color="yellow" class="-right-1/2 top-1/4" size="large" />
<Decorator color="yellow" class="-left-1/2 top-1/2" size="large" />
