// lib/eden.ts
import { edenFetch, treaty } from '@elysiajs/eden'
import type { App } from 'backend/src/index' 

export const edenTreatyApi = treaty<App>('http://localhost:3000') // or your production URL
export const edenFetchApi = edenFetch<App>('http://localhost:3000');
// For production you might use:
// export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL || 'https://your-domain.com')