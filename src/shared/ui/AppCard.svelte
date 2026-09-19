<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<article class="rounded-2xl border border-white/10 bg-[#20110b] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.18)]">
	{@render children()}
</article>
