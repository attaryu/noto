<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Download, MoveRight } from 'lucide-svelte';
	import { m } from 'paraglide/messages';

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
			<Text tag="h1" class="text-center">
				{m['recovery_key_page.heading']()}
			</Text>

			<Text tag="p" class="mt-4 text-center">
				{m['recovery_key_page.description']()}
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
							{m['recovery_key_page.agreement']()}
						</label>
					{/snippet}
				</Text>
			</div>
		</div>

		<div class="mt-auto w-full space-y-2">
			<Button variant="secondary" class="w-full" onclick={downloadAsFile}>
				<Download />
				{m['recovery_key_page.download_as_file_cta']()}
			</Button>

			<Button class="w-full" disabled={!aggreement} onclick={() => goto('/app/sign-in')}>
				{m['recovery_key_page.continue_cta']()}
				<MoveRight />
			</Button>
		</div>
	{/if}
</main>
