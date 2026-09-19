import { env } from '$env/dynamic/public';

const apiBaseUrl = env.PUBLIC_API_BASE || '/api';

export async function apiFetch<T>(
	path: string,
	init?: RequestInit,
	fetcher: typeof fetch = fetch
): Promise<T> {
	const response = await fetcher(`${apiBaseUrl}${path}`, init);

	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	return response.json() as Promise<T>;
}
