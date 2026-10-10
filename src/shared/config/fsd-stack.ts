export const fsdStack = {
	framework: 'sveltekit',
	frameworkLabel: 'SvelteKit',
	apiClient: 'fetch',
	serverState: 'svelte-query',
	clientState: 'svelte-store',
	forms: 'sveltekit-superforms-zod',
	commands: {
		generateFeature: 'npx create-fsd-architecture --generate feature auth'
	},
	docsUrl: 'https://fsdcli.me'
} as const;
