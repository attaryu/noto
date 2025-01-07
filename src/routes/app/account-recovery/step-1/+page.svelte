<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Send from 'lucide-svelte/icons/send';

	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';
	import Decorator from '$lib/components/Decorator.svelte';

	const formId = 'account-recovery-step-1';
</script>

<main class="flex h-screen flex-col p-4">
	<header class="h-12">
		<Button>
			{#snippet as(prop: any)}
				<a href="/app/sign-in" {...prop}><ArrowLeft /></a>
			{/snippet}
		</Button>
	</header>

	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">Account Recovery</Text>

		<Text tag="p" class="mt-4 text-center">
			We will send an email message along with a link to enter the recovery key
		</Text>

		<form action="" id={formId} class="mt-8 w-full">
			<Input type="email" placeholder="Email" class="w-full" />
		</form>
	</div>

	<Button form={formId} type="submit" class="mt-auto w-full"><Send /> Send now</Button>
</main>

<Decorator size="normal" color="yellow" class="top-0" />
<Decorator size="normal" color="green" class="-right-1/3 top-1/3" />
<Decorator size="large" color="yellow" class="-bottom-1/4 left-1/4" />
