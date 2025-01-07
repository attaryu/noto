<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import KeyRound from 'lucide-svelte/icons/key-round';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Input from '$lib/components/Input.svelte';
	import Text from '$lib/components/Text.svelte';

	const formId = 'account-recovery-step-2';
	const inputId = 'recovery-key-input-';
	const recoveryKey: string[] = $state(['', '', '', '', '', '', '', '']);

	const inputAndFocusOnNext = (value: string, pair: number) => {
		recoveryKey[pair] = value.toUpperCase();

		// return directly if the user deletes without focusing on the next pair
		if (value === '') {
			return;
		}

		// looping to find an empty pair input and do focus on it
		for (let nextPair = pair; nextPair < recoveryKey.length; nextPair++) {
			if (recoveryKey[nextPair] === '') {
				document.getElementById(`${inputId}-${nextPair}`)?.focus();
				break;
			}
		}
	};
</script>

<main class="flex h-screen flex-col p-4">
	<div class="mt-20 flex flex-col items-center">
		<Text tag="h1" class="text-center">Input Recovery Key</Text>

		<Text tag="p" class="mt-4 text-center">
			Use one of the recovery keys that you saved. If you lose it, there is no way out and there is
			automatic loss of access
		</Text>

		<form
			action=""
			id={formId}
			class="mt-8 flex w-full justify-between rounded-xl border border-zinc-900 bg-white p-2"
		>
			{#snippet input(value: string, pair: number)}
				<Input
					type="text"
					placeholder="-"
					{value}
					id="{inputId}-{pair}"
					class="h-12 w-8 rounded-lg p-0 text-center"
					oninput={(e) => inputAndFocusOnNext(e.currentTarget.value, pair)}
					maxlength={1}
				/>
			{/snippet}

			{@render input(recoveryKey[0], 0)}
			{@render input(recoveryKey[1], 1)}
			{@render input(recoveryKey[2], 2)}
			{@render input(recoveryKey[3], 3)}
			{@render input(recoveryKey[4], 4)}
			{@render input(recoveryKey[5], 5)}
			{@render input(recoveryKey[6], 6)}
			{@render input(recoveryKey[7], 7)}
		</form>
	</div>

	<Button form={formId} type="submit" class="mt-auto w-full"><KeyRound /> Verify</Button>
</main>

<Decorator color="green" class="-left-6 top-0" />
<Decorator color="yellow" class="-right-6 top-[15%]" />
<Decorator color="yellow" class="-bottom-10 -left-5" size="large" />
