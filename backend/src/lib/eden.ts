// lib/eden.ts
import { edenFetch, treaty } from '@elysiajs/eden'
import type { App } from '@backend/src/index' 
import { getBaseUrl } from '@lib/detectdeployed';

export const edenTreatyApi = treaty<App>(getBaseUrl()) // or your production URL
export const edenFetchApi = edenFetch<App>(getBaseUrl());
// For production you might use:
// export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL || 'https://your-domain.com')