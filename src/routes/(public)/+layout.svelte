<script lang="ts">
	import type { Snippet } from 'svelte';

	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- 2xl:w-7xl same as navbar container width -->
<div class=" mx-auto 2xl:w-7xl relative">
	<Navbar />

	<div class="w-full overflow-hidden pt-20">
		{@render children?.()}
	</div>

	<Footer />
</div>
