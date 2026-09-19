<script lang="ts">
	const layers = [
		['app', 'Bootstrap, providers, and global styles'],
		['pages', 'Route-level screen composition'],
		['widgets', 'Large reusable interface blocks'],
		['features', 'User actions and business capabilities'],
		['entities', 'Business objects and representations'],
		['shared', 'Framework-agnostic infrastructure and UI']
	];
</script>

<section class="mx-auto max-w-6xl px-6 py-24 lg:px-8">
	<div class="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
				Dependency direction
			</p>
			<h2 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
				A structure that stays clear.
			</h2>
			<p class="mt-6 max-w-xl leading-7 text-stone-400">
				Higher layers compose lower layers. SvelteKit route wrappers stay in src/routes while FSD page slices keep explicit public APIs.
			</p>
		</div>

		<ol class="space-y-3" aria-label="Feature-Sliced Design layers">
			{#each layers as [name, description], index (name)}
				<li class="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 transition hover:border-orange-300/30 hover:bg-orange-300/[0.05]">
					<span class="font-mono text-sm text-stone-600">0{index + 1}</span>
					<div>
						<p class="font-mono text-base text-orange-200">src/{name}/</p>
						<p class="mt-1 text-sm text-stone-400">{description}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>

	<footer class="mt-24 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
		<p>FSD CLI · SvelteKit template</p>
		<p>SSR native. Architecture ready.</p>
	</footer>
</section>
