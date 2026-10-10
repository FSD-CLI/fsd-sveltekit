<script lang="ts">
	import { templateInfo } from '$shared/config';
	import { AppBadge } from '$shared/ui';
</script>

<header class="mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-6 py-20 lg:px-8">
	<nav class="mb-20 flex items-center justify-between" aria-label="Primary navigation">
		<a class="flex items-center gap-3 font-semibold tracking-tight" href="#top">
			<span class="grid size-9 place-items-center rounded-xl border border-orange-300/30 bg-orange-300/10 text-orange-200">F</span>
			FSD CLI
		</a>
		<a
			class="rounded-full border border-white/15 px-4 py-2 text-sm text-orange-100 transition hover:border-orange-300/50 hover:text-white"
			href="https://fsdcli.me"
		>
			Documentation
		</a>
	</nav>

	<div id="top" class="max-w-4xl">
		<div class="flex flex-wrap gap-2">
			<AppBadge>{templateInfo.framework} · TypeScript · FSD</AppBadge>
			{#each templateInfo.stack as item (item)}
				<AppBadge>{item}</AppBadge>
			{/each}
		</div>
		<h1 class="mt-8 text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-7xl">
			SvelteKit architecture that is
			<span class="text-orange-300"> ready to scale.</span>
		</h1>
		<p class="mt-7 max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">
			SvelteKit-native routing and SSR, complete Feature-Sliced Design layers, and production guardrails from the first commit.
		</p>

		<div class="mt-10 flex flex-col gap-4 sm:flex-row">
			<code class="rounded-xl border border-orange-300/25 bg-orange-300/8 px-5 py-3.5 text-sm text-orange-100 sm:text-base">
				{templateInfo.commands.generateFeature}
			</code>
			<a
				class="rounded-xl bg-orange-300 px-5 py-3.5 text-center text-sm font-semibold text-orange-950 transition hover:bg-orange-200 sm:text-base"
				href="https://github.com/FSD-CLI"
			>
				Explore on GitHub
			</a>
		</div>
	</div>
</header>
