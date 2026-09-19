import { writable } from 'svelte/store';

export const appStatus = writable<'idle' | 'loading' | 'ready' | 'error'>('idle');
