import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "backend/src/lib/auth";
import { adminClient } from "better-auth/client/plugins"
import { getBaseUrl } from "@lib/detectdeployed";
export const authClient = createAuthClient({
  baseURL: `${getBaseUrl()}/auth/api`, // change when deployed
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});