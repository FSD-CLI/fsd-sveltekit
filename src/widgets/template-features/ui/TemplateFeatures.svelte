<script lang="ts">
	import { AppCard } from '$shared/ui';

	const features = [
		{
			eyebrow: 'Architecture',
			title: 'Complete FSD layers',
			description: 'App, pages, widgets, features, entities, and shared are ready before the first feature lands.'
		},
		{
			eyebrow: 'SvelteKit native',
			title: 'SSR-safe providers',
			description: 'Request-safe query state, file-based route wrappers, and public environment config follow SvelteKit conventions.'
		},
		{
			eyebrow: 'Forms',
			title: 'Superforms + Zod 4',
			description: 'Typed validation and progressive enhancement are ready for generated business features.'
		},
		{
			eyebrow: 'Guardrails',
			title: 'Steiger + Svelte ESLint',
			description: 'Architecture, lint, type, production build, audit, and commit checks are ready for CI.'
		}
	];
</script>

<section class="border-y border-white/10 bg-white/[0.025] py-24">
	<div class="mx-auto max-w-6xl px-6 lg:px-8">
		<div class="mb-12 max-w-2xl">
			<p class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
				SvelteKit without the setup debt
			</p>
			<h2 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
				Framework conventions and architecture boundaries together.
			</h2>
		</div>
		<div class="grid gap-5 md:grid-cols-2">
			{#each features as feature (feature.title)}
				<AppCard>
					<p class="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
						{feature.eyebrow}
					</p>
					<h3 class="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
					<p class="mt-3 leading-7 text-stone-400">{feature.description}</p>
				</AppCard>
			{/each}
		</div>
	</div>
</section>
