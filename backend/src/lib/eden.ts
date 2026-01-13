// lib/eden.ts
import { treaty } from '@elysiajs/eden'
import type { App } from 'backend/src/index' 

export const edenApi = treaty<App>('http://localhost:3000') // or your production URL
// For production you might use:
// export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL || 'https://your-domain.com')