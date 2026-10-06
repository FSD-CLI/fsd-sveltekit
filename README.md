# FSD SvelteKit Starter

SvelteKit template powered by
[Feature-Sliced Design](https://feature-sliced.design/).

This repository is the SvelteKit template used by
[`create-fsd-architecture`](https://www.npmjs.com/package/create-fsd-architecture).

## Validation scope

This is a starter template. Repository quality checks cover the checked-in
example; production deployment requires validating your application, runtime,
API integration, authentication, and hosting configuration. CLI support and
release verification are documented at [fsdcli.me](https://fsdcli.me).

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

## Dependency audit policy

`npm run audit` records the production dependency report and fails on any
finding outside the narrowly tracked [cookie exception](security/audit-exceptions.json).
The current three low entries represent one cookie advisory and its SvelteKit
aggregate, not two independent defects. No high/critical exception is allowed.
Owner: FSD-CLI maintainers (ashrafmo-1). Review deadline: 2026-11-06 UTC.
A SvelteKit major upgrade or cookie override requires compatibility verification;
this exception expires rather than silently accepting the advisory forever.
Run `npm run test:audit-policy` to verify expiry and fail-closed behavior.

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

## Support FSD CLI

If this project helps you, you can optionally support its development:

- [GitHub Sponsors](https://github.com/sponsors/ashrafmo-1?frequency=one-time&sponsor=ashrafmo-1)
- [Buy Me a Coffee](https://buymeacoffee.com/ashrafqopiah)
- **InstaPay (Egypt):** `ashrafmo-1`

For InstaPay, use the username exactly as shown and verify the recipient details
in the app before confirming a transfer. Donations are optional.
