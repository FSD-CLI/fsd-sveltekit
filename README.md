# FSD SvelteKit Starter

Production-ready SvelteKit template powered by
[Feature-Sliced Design](https://feature-sliced.design/).

This repository is the SvelteKit template used by
[`create-fsd-architecture`](https://www.npmjs.com/package/create-fsd-architecture).

## Create a project

```bash
npx create-fsd-architecture@latest my-app --framework sveltekit
```

## Stack

- Svelte 5 and SvelteKit 2
- TypeScript, runes mode, and server-side rendering
- TanStack Svelte Query with a request-safe provider
- Svelte stores for client state
- SvelteKit Superforms and Zod 4
- Axios or SvelteKit-native Fetch
- Tailwind CSS
- Steiger architecture checks
- Svelte ESLint, Husky, and Commitlint

## Architecture

```text
src/
├── app/       # bootstrap, providers, and global styles
├── pages/     # FSD page slices
├── widgets/
├── features/
├── entities/
├── shared/
└── routes/    # thin SvelteKit file-based route wrappers
```

SvelteKit file-based route wrappers live in `src/routes`, keeping the FSD
`pages` layer free from accidental nested routes. The dependency direction is
`app → pages → widgets → features → entities → shared`.

SvelteKit reserves the `$app` alias, so this template uses `$fsd-app` for the
FSD app layer and `$pages`, `$widgets`, `$features`, `$entities`, and `$shared`
for the remaining layers.

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run fsd:check
npm run lint
npm run typecheck
npm run build
npm run audit
npm run ci
```

## Generate slices

```bash
npx create-fsd-architecture --generate feature auth
npx create-fsd-architecture --generate entity product
npx create-fsd-architecture --generate widget navigation
npx create-fsd-architecture --generate page checkout
```

## Environment

Copy `.env.example` to `.env` and set the public API base URL when needed:

```bash
PUBLIC_API_BASE=https://api.example.com
```

## License

MIT
