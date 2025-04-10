<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Download, MoveRight } from 'lucide-svelte';

	import Button from '$lib/components/Button.svelte';
	import Decorator from '$lib/components/Decorator.svelte';
	import Text from '$lib/components/Text.svelte';

	import { downloadAsTextFile } from '$lib/utils/downloadAsTextFile';

	const { recoveryKeys } = page.state;

	let aggreement = $state(false);

	if (!recoveryKeys) {
		goto('/app/sign-up');
	}

	function downloadAsFile() {
		if (recoveryKeys) {
			downloadAsTextFile(recoveryKeys.join('\n'), 'noto-account-recovery-key.txt', 'text/plain');
		}
	}
</script>

<main class="flex h-screen flex-col items-center p-4">
	{#if recoveryKeys}
		<div class="mt-20">
			<Text tag="h1" class="text-center">Recovery Key</Text>

			<Text tag="p" class="mt-4 text-center">
				Save the recovery key to recover your account if you forget your password in the future.
			</Text>

			<ul
				class="row-auto mt-8 grid grid-cols-2 justify-items-center gap-2 rounded-2xl border border-zinc-900 bg-white py-6"
			>
				{#each recoveryKeys as recoveryKey}
					{@const firstPart = recoveryKey.slice(0, 4)}
					{@const secondPart = recoveryKey.slice(4)}

					<li>
						<p class="text-xl">{firstPart} - {secondPart}</p>
					</li>
				{/each}
			</ul>

			<div class="mt-8 flex items-start gap-4">
				<input type="checkbox" class="accent-zinc-900" id="agreement" bind:checked={aggreement} />

				<Text tag="small">
					{#snippet as(props)}
						<label for="agreement" {...props}>
							Take note! If you lose your recovery key, you will lose access to your account
							forever. Unless you have remembered your password again.
						</label>
					{/snippet}
				</Text>
			</div>
		</div>

		<div class="mt-auto w-full space-y-2">
			<Button variant="secondary" class="w-full" onclick={downloadAsFile}>
				<Download />

				Download recovery key
			</Button>

			<Button class="w-full" disabled={!aggreement}>
				{#snippet as(props)}
					<a href="/app/sign-in" {...props}>
						Continue to Sign In
						<MoveRight />
					</a>
				{/snippet}
			</Button>
		</div>
	{/if}
</main>

<Decorator size="normal" color="yellow" class="top-0" />
<Decorator size="normal" color="green" class="-right-1/3 top-1/3" />
<Decorator size="large" color="yellow" class="-bottom-1/4 left-1/4" />
