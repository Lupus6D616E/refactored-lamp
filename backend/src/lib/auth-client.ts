import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "backend/src/lib/auth";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/auth/api", // change when deployed
  plugins: [inferAdditionalFields<typeof auth>()],
});
