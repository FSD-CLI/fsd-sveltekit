import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_API_BASE: {
		public: true,
		schema: (value) => value || '/api',
		description: 'Base URL for API requests made by `$shared/api`. Defaults to `/api`.'
	}
});
