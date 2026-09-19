<script lang="ts">
	import QueryProvider from '$fsd-app/providers/query/QueryProvider.svelte';
	import '$fsd-app/styles/index.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>FSD CLI · SvelteKit</title>
	<meta
		name="description"
		content="A production-ready SvelteKit starter with Feature-Sliced Design architecture."
	/>
</svelte:head>

<QueryProvider>
	{@render children()}
</QueryProvider>
