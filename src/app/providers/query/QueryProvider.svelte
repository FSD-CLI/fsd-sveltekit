<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// The instance belongs to this layout render, so SSR requests never share a cache.
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60_000,
				retry: 1
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
