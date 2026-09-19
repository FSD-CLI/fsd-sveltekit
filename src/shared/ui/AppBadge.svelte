<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<span class="inline-flex items-center rounded-full border border-orange-300/20 bg-orange-300/[0.07] px-3 py-1 text-xs font-medium text-orange-100">
	{@render children()}
</span>
