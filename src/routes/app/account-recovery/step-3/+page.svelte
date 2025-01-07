<script lang="ts">
	import Send from 'lucide-svelte/icons/send';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	const formId = 'account-recovery-step-3';
</script>

<main class="flex h-screen flex-col p-4">
	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">Reset Password</Text>

		<Text tag="p" class="mt-4 text-center">
			Please enter a new password. After you submit, all devices logged in with this account will be
			automatically logged out
		</Text>

		<form action="" id={formId} class="mt-8 w-full space-y-2">
			<Input type="password" name="password" placeholder="Password" class="w-full" />
			<Input type="password" name="repeatPassword" placeholder="Repeat password" class="w-full" />
		</form>
	</div>

	<Button form={formId} type="submit" class="mt-auto w-full"><Send /> Submit</Button>
</main>

<Decorator size="normal" color="yellow" class="top-0" />
<Decorator size="normal" color="green" class="-right-1/3 top-1/3" />
<Decorator size="large" color="yellow" class="-bottom-1/4 left-1/4" />
