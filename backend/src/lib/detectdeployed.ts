export function getBaseUrl() {
  // 1. In browser → always use current origin (most reliable & handles preview/custom domains)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 2. Server/build time fallback (e.g. SSR, static rendering)
  // Vercel provides VERCEL_URL = "my-app-abc123.vercel.app" (no protocol)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Local development fallback
  return "http://localhost:3000"; // ← adjust port if needed
}